import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { householdsTable } from "./households";
import { usersTable } from "./users";

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  householdId: integer("household_id").notNull().references(() => householdsTable.id, { onDelete: "cascade" }),
  type: text("type").notNull().default("general"),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
