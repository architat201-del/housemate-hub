import { Router } from "express";
import { db } from "@workspace/db";
import { choresTable, choreCompletionsTable, membersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListChoresParams, CreateChoreParams, CreateChoreBody,
  UpdateChoreParams, UpdateChoreBody, DeleteChoreParams,
  CompleteChoreParams, CompleteChoreBody, GetChoreScheduleParams
} from "@workspace/api-zod";

const router = Router();

function formatChore(c: typeof choresTable.$inferSelect) {
  const rotationOrder = (() => {
    try { return JSON.parse(c.rotationOrder); } catch { return []; }
  })();
  return {
    ...c,
    rotationOrder,
    createdAt: c.createdAt.toISOString(),
  };
}

router.get("/households/:householdId/chores", async (req, res) => {
  try {
    const { householdId } = ListChoresParams.parse({ householdId: Number(req.params.householdId) });
    const chores = await db.select().from(choresTable).where(eq(choresTable.householdId, householdId));
    res.json(chores.map(formatChore));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list chores" });
  }
});

router.post("/households/:householdId/chores", async (req, res) => {
  try {
    const { householdId } = CreateChoreParams.parse({ householdId: Number(req.params.householdId) });
    const body = CreateChoreBody.parse(req.body);
    const [chore] = await db.insert(choresTable).values({
      householdId,
      title: body.title,
      description: body.description,
      frequency: body.frequency,
      rotationOrder: JSON.stringify(body.rotationOrder ?? []),
      currentAssigneeMemberId: body.currentAssigneeMemberId,
      nextDueDate: body.nextDueDate,
    }).returning();
    res.status(201).json(formatChore(chore));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to create chore" });
  }
});

router.patch("/chores/:choreId", async (req, res) => {
  try {
    const { choreId } = UpdateChoreParams.parse({ choreId: Number(req.params.choreId) });
    const body = UpdateChoreBody.parse(req.body);
    const [chore] = await db.update(choresTable).set({
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.frequency !== undefined && { frequency: body.frequency }),
      ...(body.rotationOrder !== undefined && { rotationOrder: JSON.stringify(body.rotationOrder) }),
      ...(body.currentAssigneeMemberId !== undefined && { currentAssigneeMemberId: body.currentAssigneeMemberId }),
      ...(body.nextDueDate !== undefined && { nextDueDate: body.nextDueDate }),
    }).where(eq(choresTable.id, choreId)).returning();
    if (!chore) return res.status(404).json({ error: "Not found" });
    res.json(formatChore(chore));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to update chore" });
  }
});

router.delete("/chores/:choreId", async (req, res) => {
  try {
    const { choreId } = DeleteChoreParams.parse({ choreId: Number(req.params.choreId) });
    await db.delete(choreCompletionsTable).where(eq(choreCompletionsTable.choreId, choreId));
    await db.delete(choresTable).where(eq(choresTable.id, choreId));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete chore" });
  }
});

router.post("/chores/:choreId/complete", async (req, res) => {
  try {
    const { choreId } = CompleteChoreParams.parse({ choreId: Number(req.params.choreId) });
    const body = CompleteChoreBody.parse(req.body);

    const [completion] = await db.insert(choreCompletionsTable).values({
      choreId,
      completedByMemberId: body.completedByMemberId,
      notes: body.notes,
    }).returning();

    // Rotate to next assignee
    const [chore] = await db.select().from(choresTable).where(eq(choresTable.id, choreId));
    if (chore) {
      const rotation: number[] = (() => {
        try { return JSON.parse(chore.rotationOrder); } catch { return []; }
      })();
      const now = new Date().toISOString();
      if (rotation.length > 1) {
        const currentIdx = rotation.indexOf(chore.currentAssigneeMemberId);
        const nextIdx = (currentIdx + 1) % rotation.length;
        await db.update(choresTable).set({
          currentAssigneeMemberId: rotation[nextIdx],
          lastCompletedAt: now.split("T")[0],
        }).where(eq(choresTable.id, choreId));
      } else {
        await db.update(choresTable).set({ lastCompletedAt: now.split("T")[0] }).where(eq(choresTable.id, choreId));
      }
    }

    res.status(201).json({
      ...completion,
      completedAt: completion.completedAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to complete chore" });
  }
});

router.get("/households/:householdId/chores/schedule", async (req, res) => {
  try {
    const { householdId } = GetChoreScheduleParams.parse({ householdId: Number(req.params.householdId) });
    const chores = await db.select().from(choresTable).where(eq(choresTable.householdId, householdId));
    const members = await db.select().from(membersTable).where(eq(membersTable.householdId, householdId));
    const memberMap = Object.fromEntries(members.map(m => [m.id, m.name]));
    const today = new Date().toISOString().split("T")[0];

    const schedule = chores.map((c) => {
      const dueDate = c.nextDueDate ?? today;
      const overdue = dueDate < today;
      return {
        choreId: c.id,
        choreTitle: c.title,
        assigneeMemberId: c.currentAssigneeMemberId,
        assigneeName: memberMap[c.currentAssigneeMemberId] ?? "Unknown",
        dueDate,
        frequency: c.frequency,
        overdue,
      };
    });

    res.json(schedule.sort((a, b) => a.dueDate.localeCompare(b.dueDate)));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get chore schedule" });
  }
});

export default router;
