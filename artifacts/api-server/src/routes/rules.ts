import { Router } from "express";
import { db } from "@workspace/db";
import { houseRulesTable, ruleSignaturesTable, membersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetHouseRulesParams, UpdateHouseRulesParams, UpdateHouseRulesBody, SignHouseRulesParams, SignHouseRulesBody } from "@workspace/api-zod";

const router = Router();

async function getRulesWithSignatures(householdId: number) {
  const [rules] = await db.select().from(houseRulesTable).where(eq(houseRulesTable.householdId, householdId));
  if (!rules) return null;
  const signatures = await db.select().from(ruleSignaturesTable).where(eq(ruleSignaturesTable.houseRulesId, rules.id));
  return {
    ...rules,
    createdAt: rules.createdAt.toISOString(),
    updatedAt: rules.updatedAt.toISOString(),
    signatures: signatures.map(s => ({ ...s, signedAt: s.signedAt.toISOString() })),
  };
}

router.get("/households/:householdId/rules", async (req, res) => {
  try {
    const { householdId } = GetHouseRulesParams.parse({ householdId: Number(req.params.householdId) });
    const rules = await getRulesWithSignatures(householdId);
    if (!rules) {
      // Return empty rules doc
      const [created] = await db.insert(houseRulesTable).values({
        householdId,
        content: "# House Rules\n\nAdd your house rules here...",
        version: 1,
      }).returning();
      return res.json({ ...created, createdAt: created.createdAt.toISOString(), updatedAt: created.updatedAt.toISOString(), signatures: [] });
    }
    res.json(rules);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get house rules" });
  }
});

router.put("/households/:householdId/rules", async (req, res) => {
  try {
    const { householdId } = UpdateHouseRulesParams.parse({ householdId: Number(req.params.householdId) });
    const body = UpdateHouseRulesBody.parse(req.body);

    const [existing] = await db.select().from(houseRulesTable).where(eq(houseRulesTable.householdId, householdId));
    if (existing) {
      const newVersion = (existing.version ?? 1) + 1;
      // Clear signatures on version bump
      await db.delete(ruleSignaturesTable).where(eq(ruleSignaturesTable.houseRulesId, existing.id));
      const [updated] = await db.update(houseRulesTable).set({
        content: body.content,
        version: newVersion,
        updatedAt: new Date(),
      }).where(eq(houseRulesTable.id, existing.id)).returning();
      return res.json({ ...updated, createdAt: updated.createdAt.toISOString(), updatedAt: updated.updatedAt.toISOString(), signatures: [] });
    } else {
      const [created] = await db.insert(houseRulesTable).values({
        householdId,
        content: body.content,
        version: 1,
      }).returning();
      return res.json({ ...created, createdAt: created.createdAt.toISOString(), updatedAt: created.updatedAt.toISOString(), signatures: [] });
    }
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to update house rules" });
  }
});

router.post("/households/:householdId/rules/sign", async (req, res) => {
  try {
    const { householdId } = SignHouseRulesParams.parse({ householdId: Number(req.params.householdId) });
    const body = SignHouseRulesBody.parse(req.body);

    const [rules] = await db.select().from(houseRulesTable).where(eq(houseRulesTable.householdId, householdId));
    if (!rules) return res.status(404).json({ error: "House rules not found" });

    const [member] = await db.select().from(membersTable).where(eq(membersTable.id, body.memberId));
    if (!member) return res.status(404).json({ error: "Member not found" });

    const [signature] = await db.insert(ruleSignaturesTable).values({
      houseRulesId: rules.id,
      memberId: body.memberId,
      memberName: member.name,
    }).returning();

    res.status(201).json({ ...signature, signedAt: signature.signedAt.toISOString() });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to sign house rules" });
  }
});

export default router;
