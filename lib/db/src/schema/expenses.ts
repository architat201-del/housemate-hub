import { pgTable, serial, text, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const expensesTable = pgTable("expenses", {
  id: serial("id").primaryKey(),
  householdId: integer("household_id").notNull(),
  title: text("title").notNull(),
  amount: real("amount").notNull(),
  category: text("category").notNull().default("other"),
  paidByMemberId: integer("paid_by_member_id").notNull(),
  splitType: text("split_type").notNull().default("equal"),
  settled: boolean("settled").notNull().default(false),
  notes: text("notes"),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const expenseSplitsTable = pgTable("expense_splits", {
  id: serial("id").primaryKey(),
  expenseId: integer("expense_id").notNull(),
  memberId: integer("member_id").notNull(),
  amount: real("amount").notNull(),
  paid: boolean("paid").notNull().default(false),
});

export const insertExpenseSchema = createInsertSchema(expensesTable).omit({ id: true, createdAt: true });
export const insertExpenseSplitSchema = createInsertSchema(expenseSplitsTable).omit({ id: true });
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expensesTable.$inferSelect;
export type ExpenseSplit = typeof expenseSplitsTable.$inferSelect;
