import { Router } from "express";
import { db } from "@workspace/db";
import { householdsTable, membersTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateHouseholdBody, UpdateHouseholdBody, GetHouseholdParams, UpdateHouseholdParams } from "@workspace/api-zod";
import { requireAuth } from "../middleware/auth";
import { z } from "zod/v4";
import crypto from "crypto";

const router = Router();

function generateInviteCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

router.get("/households", async (req, res) => {
  try {
    const households = await db.select().from(householdsTable).orderBy(householdsTable.createdAt);
    res.json(households.map(h => ({
      ...h,
      createdAt: h.createdAt.toISOString(),
      totalRent: h.totalRent ?? 0,
    })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list households" });
  }
});

router.post("/households", requireAuth, async (req, res) => {
  try {
    const body = CreateHouseholdBody.parse(req.body);
    let inviteCode = generateInviteCode();
    // Ensure uniqueness (very unlikely collision but safe)
    let attempts = 0;
    while (attempts < 5) {
      const [existing] = await db.select().from(householdsTable).where(eq(householdsTable.inviteCode, inviteCode));
      if (!existing) break;
      inviteCode = generateInviteCode();
      attempts++;
    }

    const [household] = await db.insert(householdsTable).values({
      name: body.name,
      address: body.address,
      totalRent: body.totalRent,
      leaseStart: body.leaseStart,
      leaseEnd: body.leaseEnd,
      landlordName: body.landlordName,
      landlordEmail: body.landlordEmail,
      inviteCode,
    }).returning();

    // Auto-create member record for the creating user
    const userId = req.session.userId!;
    const [user] = await db
      .select({ name: usersTable.name, email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.id, userId));
    if (user) {
      await db.insert(membersTable).values({
        householdId: household.id,
        userId,
        name: user.name,
        email: user.email,
        role: "admin",
        rentShare: 0,
        moveInDate: new Date().toISOString().split("T")[0],
      });
    }

    res.status(201).json({ ...household, createdAt: household.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to create household" });
  }
});

router.post("/households/join", requireAuth, async (req, res) => {
  try {
    const { inviteCode } = z.object({ inviteCode: z.string().min(1) }).parse(req.body);
    const userId = req.session.userId!;

    const [household] = await db.select().from(householdsTable).where(eq(householdsTable.inviteCode, inviteCode.toUpperCase()));
    if (!household) {
      return res.status(404).json({ error: "Invalid invite code" });
    }

    // Check if user already a member
    const [existing] = await db.select().from(membersTable)
      .where(eq(membersTable.userId, userId));
    if (existing) {
      return res.status(409).json({ error: "You are already a member of a household" });
    }

    const [user] = await db
      .select({ name: usersTable.name, email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.id, userId));
    if (!user) return res.status(404).json({ error: "User not found" });

    const [member] = await db.insert(membersTable).values({
      householdId: household.id,
      userId,
      name: user.name,
      email: user.email,
      role: "member",
      rentShare: 0,
      moveInDate: new Date().toISOString().split("T")[0],
    }).returning();

    res.status(201).json({
      householdId: household.id,
      memberId: member.id,
      household: { ...household, createdAt: household.createdAt.toISOString() },
    });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to join household" });
  }
});

router.get("/households/:householdId", async (req, res) => {
  try {
    const { householdId } = GetHouseholdParams.parse({ householdId: Number(req.params.householdId) });
    const [household] = await db.select().from(householdsTable).where(eq(householdsTable.id, householdId));
    if (!household) return res.status(404).json({ error: "Not found" });
    res.json({ ...household, createdAt: household.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get household" });
  }
});

router.patch("/households/:householdId", requireAuth, async (req, res) => {
  try {
    const { householdId } = UpdateHouseholdParams.parse({ householdId: Number(req.params.householdId) });
    const body = UpdateHouseholdBody.parse(req.body);
    const [household] = await db.update(householdsTable).set({
      ...(body.name !== undefined && { name: body.name }),
      ...(body.address !== undefined && { address: body.address }),
      ...(body.totalRent !== undefined && { totalRent: body.totalRent }),
      ...(body.leaseStart !== undefined && { leaseStart: body.leaseStart }),
      ...(body.leaseEnd !== undefined && { leaseEnd: body.leaseEnd }),
      ...(body.landlordName !== undefined && { landlordName: body.landlordName }),
      ...(body.landlordEmail !== undefined && { landlordEmail: body.landlordEmail }),
    }).where(eq(householdsTable.id, householdId)).returning();
    if (!household) return res.status(404).json({ error: "Not found" });
    res.json({ ...household, createdAt: household.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to update household" });
  }
});

export default router;
