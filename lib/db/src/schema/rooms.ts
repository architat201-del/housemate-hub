import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const roomsTable = pgTable("rooms", {
  id: serial("id").primaryKey(),
  householdId: integer("household_id").notNull(),
  name: text("name").notNull(),
  monthlyRent: real("monthly_rent").notNull().default(0),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRoomSchema = createInsertSchema(roomsTable).omit({ id: true, createdAt: true });
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof roomsTable.$inferSelect;
