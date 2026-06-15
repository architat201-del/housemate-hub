import { Router } from "express";
import { db } from "@workspace/db";
import { membersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListMembersParams, AddMemberBody, AddMemberParams, UpdateMemberParams, UpdateMemberBody, RemoveMemberParams } from "@workspace/api-zod";

const router = Router();

const formatMember = (m: typeof membersTable.$inferSelect) => ({
  ...m,
  createdAt: m.createdAt.toISOString(),
  moveInDate: m.moveInDate ?? new Date().toISOString().split("T")[0],
});

router.get("/households/:householdId/members", async (req, res) => {
  try {
    const { householdId } = ListMembersParams.parse({ householdId: Number(req.params.householdId) });
    const members = await db.select().from(membersTable).where(eq(membersTable.householdId, householdId));
    res.json(members.map(formatMember));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list members" });
  }
});

router.post("/households/:householdId/members", async (req, res) => {
  try {
    const { householdId } = AddMemberParams.parse({ householdId: Number(req.params.householdId) });
    const body = AddMemberBody.parse(req.body);
    const [member] = await db.insert(membersTable).values({
      householdId,
      name: body.name,
      email: body.email,
      role: body.role ?? "member",
      rentShare: body.rentShare,
      avatarColor: body.avatarColor,
      roomId: body.roomId,
      moveInDate: body.moveInDate ?? new Date().toISOString().split("T")[0],
    }).returning();
    res.status(201).json(formatMember(member));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to add member" });
  }
});

router.patch("/members/:memberId", async (req, res) => {
  try {
    const { memberId } = UpdateMemberParams.parse({ memberId: Number(req.params.memberId) });
    const body = UpdateMemberBody.parse(req.body);
    const [member] = await db.update(membersTable).set({
      ...(body.name !== undefined && { name: body.name }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.role !== undefined && { role: body.role }),
      ...(body.rentShare !== undefined && { rentShare: body.rentShare }),
      ...(body.avatarColor !== undefined && { avatarColor: body.avatarColor }),
      ...(body.roomId !== undefined && { roomId: body.roomId }),
    }).where(eq(membersTable.id, memberId)).returning();
    if (!member) return res.status(404).json({ error: "Not found" });
    res.json(formatMember(member));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to update member" });
  }
});

router.delete("/members/:memberId", async (req, res) => {
  try {
    const { memberId } = RemoveMemberParams.parse({ memberId: Number(req.params.memberId) });
    await db.delete(membersTable).where(eq(membersTable.id, memberId));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to remove member" });
  }
});

export default router;
