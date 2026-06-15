import { Router } from "express";
import { db } from "@workspace/db";
import { householdsTable, membersTable, expensesTable, expenseSplitsTable, choresTable, paymentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/households/:householdId/dashboard", async (req, res) => {
  try {
    const householdId = Number(req.params.householdId);
    const [household] = await db.select().from(householdsTable).where(eq(householdsTable.id, householdId));
    if (!household) return res.status(404).json({ error: "Not found" });

    const members = await db.select().from(membersTable).where(eq(membersTable.householdId, householdId));
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    const payments = await db.select().from(paymentsTable).where(eq(paymentsTable.householdId, householdId));
    const thisMonthPayments = payments.filter(p => p.month === currentMonth);

    const paidTotal = thisMonthPayments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
    const pendingTotal = thisMonthPayments.filter(p => p.status === "pending" || p.status === "partial").reduce((s, p) => s + p.amount, 0);
    const lateTotal = thisMonthPayments.filter(p => p.status === "late").reduce((s, p) => s + p.amount, 0);

    const allExpenses = await db.select().from(expensesTable).where(eq(expensesTable.householdId, householdId));
    const unsettled = allExpenses.filter(e => !e.settled);
    const pendingExpenseTotal = unsettled.reduce((s, e) => s + e.amount, 0);

    const chores = await db.select().from(choresTable).where(eq(choresTable.householdId, householdId));
    const todayStr = today.toISOString().split("T")[0];
    const overdueChores = chores.filter(c => c.nextDueDate && c.nextDueDate < todayStr).length;
    const upcomingChores = chores.filter(c => !c.nextDueDate || c.nextDueDate >= todayStr).length;

    const recentExpenses = allExpenses
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const recentWithSplits = await Promise.all(recentExpenses.map(async (e) => {
      const splits = await db.select().from(expenseSplitsTable).where(eq(expenseSplitsTable.expenseId, e.id));
      return { ...e, createdAt: e.createdAt.toISOString(), splits };
    }));

    res.json({
      householdId,
      totalRent: household.totalRent,
      memberCount: members.length,
      rentDueDate: household.leaseStart ? null : null,
      currentMonthPayments: {
        paid: paidTotal,
        pending: pendingTotal,
        late: lateTotal,
      },
      pendingExpenseTotal,
      overdueChores,
      upcomingChores,
      recentExpenses: recentWithSplits,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get dashboard" });
  }
});

router.get("/households/:householdId/expenses/summary", async (req, res) => {
  try {
    const householdId = Number(req.params.householdId);
    const expenses = await db.select().from(expensesTable).where(eq(expensesTable.householdId, householdId));

    const categoryMap: Record<string, { total: number; count: number }> = {};
    for (const e of expenses) {
      if (!categoryMap[e.category]) categoryMap[e.category] = { total: 0, count: 0 };
      categoryMap[e.category].total += e.amount;
      categoryMap[e.category].count += 1;
    }

    const summary = Object.entries(categoryMap).map(([category, data]) => ({
      category,
      total: Math.round(data.total * 100) / 100,
      count: data.count,
    })).sort((a, b) => b.total - a.total);

    res.json(summary);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get expense summary" });
  }
});

router.get("/households/:householdId/balances", async (req, res) => {
  try {
    const householdId = Number(req.params.householdId);
    const members = await db.select().from(membersTable).where(eq(membersTable.householdId, householdId));
    const expenses = await db.select().from(expensesTable).where(eq(expensesTable.householdId, householdId));

    // Calculate net balances
    const balances: Record<number, { totalOwed: number; totalOwes: number }> = {};
    for (const m of members) {
      balances[m.id] = { totalOwed: 0, totalOwes: 0 };
    }

    for (const e of expenses.filter(exp => !exp.settled)) {
      const splits = await db.select().from(expenseSplitsTable).where(eq(expenseSplitsTable.expenseId, e.id));
      for (const split of splits) {
        if (split.memberId === e.paidByMemberId) continue;
        if (!split.paid) {
          if (balances[e.paidByMemberId]) balances[e.paidByMemberId].totalOwed += split.amount;
          if (balances[split.memberId]) balances[split.memberId].totalOwes += split.amount;
        }
      }
    }

    const result = members.map(m => ({
      memberId: m.id,
      memberName: m.name,
      avatarColor: m.avatarColor,
      totalOwed: Math.round((balances[m.id]?.totalOwed ?? 0) * 100) / 100,
      totalOwes: Math.round((balances[m.id]?.totalOwes ?? 0) * 100) / 100,
      netBalance: Math.round(((balances[m.id]?.totalOwed ?? 0) - (balances[m.id]?.totalOwes ?? 0)) * 100) / 100,
    }));

    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get balances" });
  }
});

export default router;
