import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const houseRulesTable = pgTable("house_rules", {
  id: serial("id").primaryKey(),
  householdId: integer("household_id").notNull(),
  content: text("content").notNull(),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ruleSignaturesTable = pgTable("rule_signatures", {
  id: serial("id").primaryKey(),
  houseRulesId: integer("house_rules_id").notNull(),
  memberId: integer("member_id").notNull(),
  memberName: text("member_name").notNull(),
  signedAt: timestamp("signed_at").defaultNow().notNull(),
});

export const insertHouseRulesSchema = createInsertSchema(houseRulesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRuleSignatureSchema = createInsertSchema(ruleSignaturesTable).omit({ id: true, signedAt: true });
export type InsertHouseRules = z.infer<typeof insertHouseRulesSchema>;
export type HouseRules = typeof houseRulesTable.$inferSelect;
export type RuleSignature = typeof ruleSignaturesTable.$inferSelect;
