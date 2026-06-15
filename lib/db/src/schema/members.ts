import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const membersTable = pgTable("members", {
  id: serial("id").primaryKey(),
  householdId: integer("household_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("member"),
  rentShare: real("rent_share").notNull().default(0),
  avatarColor: text("avatar_color"),
  roomId: integer("room_id"),
  moveInDate: text("move_in_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMemberSchema = createInsertSchema(membersTable).omit({ id: true, createdAt: true });
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof membersTable.$inferSelect;
