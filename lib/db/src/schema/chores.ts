import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const choresTable = pgTable("chores", {
  id: serial("id").primaryKey(),
  householdId: integer("household_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  frequency: text("frequency").notNull().default("weekly"),
  rotationOrder: text("rotation_order").notNull().default("[]"),
  currentAssigneeMemberId: integer("current_assignee_member_id").notNull(),
  nextDueDate: text("next_due_date"),
  lastCompletedAt: text("last_completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const choreCompletionsTable = pgTable("chore_completions", {
  id: serial("id").primaryKey(),
  choreId: integer("chore_id").notNull(),
  completedByMemberId: integer("completed_by_member_id").notNull(),
  notes: text("notes"),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const insertChoreSchema = createInsertSchema(choresTable).omit({ id: true, createdAt: true });
export const insertChoreCompletionSchema = createInsertSchema(choreCompletionsTable).omit({ id: true, completedAt: true });
export type InsertChore = z.infer<typeof insertChoreSchema>;
export type Chore = typeof choresTable.$inferSelect;
export type ChoreCompletion = typeof choreCompletionsTable.$inferSelect;
