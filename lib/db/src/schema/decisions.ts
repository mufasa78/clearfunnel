import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { rolesTable } from "./roles";
import { candidatesTable } from "./candidates";

export const decisionsTable = pgTable("decisions", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull().references(() => candidatesTable.id),
  roleId: integer("role_id").notNull().references(() => rolesTable.id),
  rejectionSummary: text("rejection_summary").notNull(),
  recoverable: boolean("recoverable").notNull().default(true),
  recovered: boolean("recovered").notNull().default(false),
  recoveredAt: timestamp("recovered_at", { withTimezone: true }),
  recoveredBy: text("recovered_by"),
  rejectedAt: timestamp("rejected_at", { withTimezone: true }).notNull().defaultNow(),

  // Intelligence fields
  confidenceScore: integer("confidence_score"),    // 0–100 decision confidence
  evidenceCount: integer("evidence_count"),        // number of rules triggered
  recruiterId: text("recruiter_id"),               // who processed this decision
  evidenceStrength: text("evidence_strength"),     // strong | moderate | weak
});

export const decisionRulesTable = pgTable("decision_rules", {
  id: serial("id").primaryKey(),
  decisionId: integer("decision_id").notNull().references(() => decisionsTable.id),
  ruleId: integer("rule_id").notNull(),
  ruleName: text("rule_name").notNull(),
  ruleDescription: text("rule_description").notNull(),
});

export const insertDecisionSchema = createInsertSchema(decisionsTable).omit({ id: true, rejectedAt: true });
export type InsertDecision = z.infer<typeof insertDecisionSchema>;
export type Decision = typeof decisionsTable.$inferSelect;
