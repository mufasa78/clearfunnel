import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { rolesTable } from "./roles";

export const filterRulesTable = pgTable("filter_rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  ruleType: text("rule_type").notNull(), // keyword_match | employment_gap | degree_requirement | experience_years | location | custom
  criteria: text("criteria").notNull(),
  status: text("status").notNull().default("pending_validation"), // active | archived | pending_validation
  version: integer("version").notNull().default(1),
  roleId: integer("role_id").references(() => rolesTable.id),
  lastValidatedAt: timestamp("last_validated_at", { withTimezone: true }),
  validationStatus: text("validation_status"), // passed | failed | not_run
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const ruleHistoryTable = pgTable("rule_history", {
  id: serial("id").primaryKey(),
  ruleId: integer("rule_id").notNull().references(() => filterRulesTable.id),
  version: integer("version").notNull(),
  changedBy: text("changed_by").notNull(),
  changes: text("changes").notNull(),
  changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFilterRuleSchema = createInsertSchema(filterRulesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFilterRule = z.infer<typeof insertFilterRuleSchema>;
export type FilterRule = typeof filterRulesTable.$inferSelect;
export type RuleHistory = typeof ruleHistoryTable.$inferSelect;
