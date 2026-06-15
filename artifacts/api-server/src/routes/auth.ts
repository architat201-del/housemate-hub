import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, membersTable, householdsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

const router = Router();

const RegisterBody = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(6),
});

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/auth/register", async (req, res) => {
  try {
    const body = RegisterBody.parse(req.body);

    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const [user] = await db.insert(usersTable).values({
      email: body.email,
      name: body.name,
      passwordHash,
    }).returning();

    req.session.userId = user.id;
    req.session.save((err) => {
      if (err) req.log.error(err);
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      householdId: null,
      memberId: null,
    });
  } catch (err) {
    req.log.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: err.errors });
    }
    return res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const body = LoginBody.parse(req.body);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, body.email));
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const [member] = await db
      .select({ id: membersTable.id, householdId: membersTable.householdId })
      .from(membersTable)
      .where(eq(membersTable.userId, user.id));

    req.session.userId = user.id;
    req.session.save((err) => {
      if (err) req.log.error(err);
    });

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      householdId: member?.householdId ?? null,
      memberId: member?.id ?? null,
    });
  } catch (err) {
    req.log.error(err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input" });
    }
    return res.status(500).json({ error: "Login failed" });
  }
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) req.log.error(err);
  });
  res.clearCookie("roomly.sid");
  return res.json({ ok: true });
});

router.get("/auth/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId));
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "User not found" });
    }

    const [member] = await db
      .select({ id: membersTable.id, householdId: membersTable.householdId })
      .from(membersTable)
      .where(eq(membersTable.userId, user.id));

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      householdId: member?.householdId ?? null,
      memberId: member?.id ?? null,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
