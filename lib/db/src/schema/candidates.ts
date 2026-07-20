import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { rolesTable } from "./roles";

export const candidatesTable = pgTable("candidates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  roleId: integer("role_id").notNull().references(() => rolesTable.id),
  rejectedAt: timestamp("rejected_at", { withTimezone: true }).notNull().defaultNow(),
  recovered: boolean("recovered").notNull().default(false),
  recoveredAt: timestamp("recovered_at", { withTimezone: true }),
  recoveredBy: text("recovered_by"),
  recoveryReason: text("recovery_reason"),
  retentionExpiresAt: timestamp("retention_expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCandidateSchema = createInsertSchema(candidatesTable).omit({ id: true, createdAt: true });
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidatesTable.$inferSelect;
