import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const householdsTable = pgTable("households", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  totalRent: real("total_rent").notNull().default(0),
  leaseStart: text("lease_start"),
  leaseEnd: text("lease_end"),
  landlordName: text("landlord_name"),
  landlordEmail: text("landlord_email"),
  inviteCode: text("invite_code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHouseholdSchema = createInsertSchema(householdsTable).omit({ id: true, createdAt: true });
export type InsertHousehold = z.infer<typeof insertHouseholdSchema>;
export type Household = typeof householdsTable.$inferSelect;
