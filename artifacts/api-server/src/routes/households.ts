import { Router } from "express";
import { db } from "@workspace/db";
import { householdsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateHouseholdBody, UpdateHouseholdBody, GetHouseholdParams, UpdateHouseholdParams } from "@workspace/api-zod";

const router = Router();

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

router.post("/households", async (req, res) => {
  try {
    const body = CreateHouseholdBody.parse(req.body);
    const [household] = await db.insert(householdsTable).values({
      name: body.name,
      address: body.address,
      totalRent: body.totalRent,
      leaseStart: body.leaseStart,
      leaseEnd: body.leaseEnd,
      landlordName: body.landlordName,
      landlordEmail: body.landlordEmail,
    }).returning();
    res.status(201).json({ ...household, createdAt: household.createdAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to create household" });
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

router.patch("/households/:householdId", async (req, res) => {
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
