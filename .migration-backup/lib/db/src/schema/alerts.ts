import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { rolesTable } from "./roles";

export const alertsTable = pgTable("alerts", {
  id: serial("id").primaryKey(),
  roleId: integer("role_id").notNull().references(() => rolesTable.id),
  alertType: text("alert_type").notNull(), // rejection_spike | rejection_drop | validation_failure | rule_change
  severity: text("severity").notNull(), // low | medium | high | critical
  message: text("message").notNull(),
  correlatedRuleId: integer("correlated_rule_id"),
  correlatedRuleName: text("correlated_rule_name"),
  status: text("status").notNull().default("open"), // open | resolved
  detectedAt: timestamp("detected_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  resolvedBy: text("resolved_by"),
});

export const insertAlertSchema = createInsertSchema(alertsTable).omit({ id: true, detectedAt: true });
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alertsTable.$inferSelect;
