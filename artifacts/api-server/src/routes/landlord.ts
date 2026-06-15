import { Router } from "express";
import { db } from "@workspace/db";
import { householdsTable, membersTable, paymentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/landlord/households", async (req, res) => {
  try {
    const households = await db.select().from(householdsTable);

    const result = await Promise.all(households.map(async (h) => {
      const members = await db.select().from(membersTable).where(eq(membersTable.householdId, h.id));
      const payments = await db.select().from(paymentsTable).where(eq(paymentsTable.householdId, h.id));

      const paidCount = payments.filter(p => p.status === "paid").length;
      const onTimeRate = payments.length > 0 ? Math.round((paidCount / payments.length) * 100) / 100 : 1;

      const today = new Date();
      const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
      const thisMonth = payments.filter(p => p.month === currentMonth);
      const allPaid = thisMonth.length > 0 && thisMonth.every(p => p.status === "paid");
      const nonePaid = thisMonth.length === 0 || thisMonth.every(p => p.status === "pending");
      const currentMonthStatus = allPaid ? "all_paid" : nonePaid ? "none_paid" : "partial";

      return {
        id: h.id,
        name: h.name,
        address: h.address,
        totalRent: h.totalRent,
        memberCount: members.length,
        onTimeRate,
        currentMonthStatus,
      };
    }));

    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list landlord households" });
  }
});

router.get("/landlord/households/:householdId/payment-stats", async (req, res) => {
  try {
    const householdId = Number(req.params.householdId);
    const payments = await db.select().from(paymentsTable).where(eq(paymentsTable.householdId, householdId));

    const onTimeCount = payments.filter(p => p.status === "paid").length;
    const lateCount = payments.filter(p => p.status === "late").length;
    const onTimeRate = payments.length > 0 ? Math.round((onTimeCount / payments.length) * 100) / 100 : 1;

    // Days late calc (simplified)
    const latePayments = payments.filter(p => p.status === "late" && p.dueDate && p.paidDate);
    const avgDaysLate = latePayments.length > 0
      ? latePayments.reduce((sum, p) => {
          const due = new Date(p.dueDate!);
          const paid = new Date(p.paidDate!);
          return sum + Math.max(0, (paid.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
        }, 0) / latePayments.length
      : 0;

    // Monthly breakdown
    const monthMap: Record<string, { totalDue: number; totalPaid: number; onTime: number; late: number }> = {};
    for (const p of payments) {
      if (!monthMap[p.month]) monthMap[p.month] = { totalDue: 0, totalPaid: 0, onTime: 0, late: 0 };
      monthMap[p.month].totalDue += p.amount;
      if (p.status === "paid") {
        monthMap[p.month].totalPaid += p.amount;
        monthMap[p.month].onTime += 1;
      } else if (p.status === "late") {
        monthMap[p.month].totalPaid += p.amount;
        monthMap[p.month].late += 1;
      }
    }

    const monthlyBreakdown = Object.entries(monthMap)
      .map(([month, data]) => ({ month, ...data, totalDue: Math.round(data.totalDue * 100) / 100, totalPaid: Math.round(data.totalPaid * 100) / 100 }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.json({
      householdId,
      totalPayments: payments.length,
      onTimeCount,
      lateCount,
      onTimeRate,
      averageDaysLate: Math.round(avgDaysLate * 10) / 10,
      monthlyBreakdown,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get payment stats" });
  }
});

export default router;
