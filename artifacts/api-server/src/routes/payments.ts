import { Router } from "express";
import { db } from "@workspace/db";
import { paymentsTable, membersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListPaymentsParams, RecordPaymentParams, RecordPaymentBody, UpdatePaymentParams, UpdatePaymentBody } from "@workspace/api-zod";

const router = Router();

async function formatPayment(p: typeof paymentsTable.$inferSelect) {
  const [member] = await db.select().from(membersTable).where(eq(membersTable.id, p.memberId));
  return {
    ...p,
    memberName: member?.name ?? "Unknown",
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/households/:householdId/payments", async (req, res) => {
  try {
    const { householdId } = ListPaymentsParams.parse({ householdId: Number(req.params.householdId) });
    const payments = await db.select().from(paymentsTable).where(eq(paymentsTable.householdId, householdId)).orderBy(paymentsTable.createdAt);
    const result = await Promise.all(payments.map(formatPayment));
    res.json(result.reverse());
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list payments" });
  }
});

router.post("/households/:householdId/payments", async (req, res) => {
  try {
    const { householdId } = RecordPaymentParams.parse({ householdId: Number(req.params.householdId) });
    const body = RecordPaymentBody.parse(req.body);
    const [payment] = await db.insert(paymentsTable).values({
      householdId,
      memberId: body.memberId,
      amount: body.amount,
      month: body.month,
      dueDate: body.dueDate,
      paidDate: body.paidDate,
      status: body.status ?? "pending",
      notes: body.notes,
    }).returning();
    res.status(201).json(await formatPayment(payment));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to record payment" });
  }
});

router.patch("/payments/:paymentId", async (req, res) => {
  try {
    const { paymentId } = UpdatePaymentParams.parse({ paymentId: Number(req.params.paymentId) });
    const body = UpdatePaymentBody.parse(req.body);
    const [payment] = await db.update(paymentsTable).set({
      ...(body.amount !== undefined && { amount: body.amount }),
      ...(body.paidDate !== undefined && { paidDate: body.paidDate }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.notes !== undefined && { notes: body.notes }),
    }).where(eq(paymentsTable.id, paymentId)).returning();
    if (!payment) return res.status(404).json({ error: "Not found" });
    res.json(await formatPayment(payment));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to update payment" });
  }
});

export default router;
