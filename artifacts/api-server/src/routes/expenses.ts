import { Router } from "express";
import { db } from "@workspace/db";
import { expensesTable, expenseSplitsTable, membersTable, notificationsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListExpensesParams, CreateExpenseParams, CreateExpenseBody,
  GetExpenseParams, UpdateExpenseParams, UpdateExpenseBody,
  DeleteExpenseParams, SettleExpenseParams
} from "@workspace/api-zod";

const router = Router();

async function getExpenseWithSplits(expenseId: number) {
  const [expense] = await db.select().from(expensesTable).where(eq(expensesTable.id, expenseId));
  if (!expense) return null;
  const splits = await db.select().from(expenseSplitsTable).where(eq(expenseSplitsTable.expenseId, expenseId));
  return {
    ...expense,
    createdAt: expense.createdAt.toISOString(),
    splits,
  };
}

router.get("/households/:householdId/expenses", async (req, res) => {
  try {
    const { householdId } = ListExpensesParams.parse({ householdId: Number(req.params.householdId) });
    const expenses = await db.select().from(expensesTable).where(eq(expensesTable.householdId, householdId)).orderBy(expensesTable.createdAt);
    const result = await Promise.all(expenses.map(async (e) => {
      const splits = await db.select().from(expenseSplitsTable).where(eq(expenseSplitsTable.expenseId, e.id));
      return { ...e, createdAt: e.createdAt.toISOString(), splits };
    }));
    res.json(result.reverse());
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list expenses" });
  }
});

router.post("/households/:householdId/expenses", async (req, res) => {
  try {
    const { householdId } = CreateExpenseParams.parse({ householdId: Number(req.params.householdId) });
    const body = CreateExpenseBody.parse(req.body);

    const [expense] = await db.insert(expensesTable).values({
      householdId,
      title: body.title,
      amount: body.amount,
      category: body.category,
      paidByMemberId: body.paidByMemberId,
      splitType: body.splitType,
      settled: false,
      notes: body.notes,
      date: body.date,
    }).returning();

    // Create splits
    if (body.splitType === "custom" && body.customSplits && body.customSplits.length > 0) {
      const splitValues = body.customSplits.map((s: { memberId: number; amount: number }) => ({
        expenseId: expense.id,
        memberId: s.memberId,
        amount: s.amount,
        paid: s.memberId === body.paidByMemberId,
      }));
      await db.insert(expenseSplitsTable).values(splitValues);
    } else {
      // Equal split among all household members
      const members = await db.select().from(membersTable).where(eq(membersTable.householdId, householdId));
      if (members.length > 0) {
        const perPerson = body.amount / members.length;
        const splitValues = members.map((m) => ({
          expenseId: expense.id,
          memberId: m.id,
          amount: Math.round(perPerson * 100) / 100,
          paid: m.id === body.paidByMemberId,
        }));
        await db.insert(expenseSplitsTable).values(splitValues);
      }
    }

    const full = await getExpenseWithSplits(expense.id);

    // Notify all household members (except the payer) about the new expense
    try {
      const allMembers = await db.select({ id: membersTable.id, userId: membersTable.userId, name: membersTable.name })
        .from(membersTable).where(eq(membersTable.householdId, householdId));
      const paidByMember = allMembers.find((m) => m.id === body.paidByMemberId);
      const payerName = paidByMember?.name ?? "Someone";
      const perPerson = body.amount / (allMembers.length || 1);
      const notifRows = allMembers
        .filter((m) => m.userId != null && m.id !== body.paidByMemberId)
        .map((m) => ({
          userId: m.userId!,
          householdId,
          type: "expense" as const,
          title: `New expense: ${body.title}`,
          message: `${payerName} paid $${body.amount.toFixed(2)} — your share is $${perPerson.toFixed(2)}`,
        }));
      if (notifRows.length > 0) {
        await db.insert(notificationsTable).values(notifRows);
      }
    } catch {}

    res.status(201).json(full);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to create expense" });
  }
});

router.get("/expenses/:expenseId", async (req, res) => {
  try {
    const { expenseId } = GetExpenseParams.parse({ expenseId: Number(req.params.expenseId) });
    const expense = await getExpenseWithSplits(expenseId);
    if (!expense) return res.status(404).json({ error: "Not found" });
    res.json(expense);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get expense" });
  }
});

router.patch("/expenses/:expenseId", async (req, res) => {
  try {
    const { expenseId } = UpdateExpenseParams.parse({ expenseId: Number(req.params.expenseId) });
    const body = UpdateExpenseBody.parse(req.body);
    await db.update(expensesTable).set({
      ...(body.title !== undefined && { title: body.title }),
      ...(body.amount !== undefined && { amount: body.amount }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.date !== undefined && { date: body.date }),
    }).where(eq(expensesTable.id, expenseId));
    const expense = await getExpenseWithSplits(expenseId);
    if (!expense) return res.status(404).json({ error: "Not found" });
    res.json(expense);
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to update expense" });
  }
});

router.delete("/expenses/:expenseId", async (req, res) => {
  try {
    const { expenseId } = DeleteExpenseParams.parse({ expenseId: Number(req.params.expenseId) });
    await db.delete(expenseSplitsTable).where(eq(expenseSplitsTable.expenseId, expenseId));
    await db.delete(expensesTable).where(eq(expensesTable.id, expenseId));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

router.post("/expenses/:expenseId/settle", async (req, res) => {
  try {
    const { expenseId } = SettleExpenseParams.parse({ expenseId: Number(req.params.expenseId) });
    await db.update(expensesTable).set({ settled: true }).where(eq(expensesTable.id, expenseId));
    await db.update(expenseSplitsTable).set({ paid: true }).where(eq(expenseSplitsTable.expenseId, expenseId));
    const expense = await getExpenseWithSplits(expenseId);
    if (!expense) return res.status(404).json({ error: "Not found" });
    res.json(expense);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to settle expense" });
  }
});

export default router;
