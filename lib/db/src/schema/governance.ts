import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const governanceSnapshotsTable = pgTable("governance_snapshots", {
  id: serial("id").primaryKey(),
  snapshotDate: timestamp("snapshot_date", { withTimezone: true }).notNull(),

  // Composite score
  governanceScore: integer("governance_score").notNull(),   // 0–100

  // Component scores
  ruleAccuracy: integer("rule_accuracy").notNull(),          // 0–100
  falseRejectionRate: real("false_rejection_rate").notNull(), // 0–100 (lower is better)
  recoverySuccessRate: integer("recovery_success_rate").notNull(), // 0–100
  recruiterConsistency: integer("recruiter_consistency").notNull(), // 0–100
  explainabilityCoverage: integer("explainability_coverage").notNull(), // 0–100
  biasRisk: real("bias_risk").notNull(),                    // 0–100 (lower is better)
  validationPassRate: integer("validation_pass_rate").notNull(), // 0–100

  // ATS Health
  atsHealthScore: integer("ats_health_score").notNull(),     // 0–100

  // Financial impact
  estimatedRevenueLost: integer("estimated_revenue_lost"),   // USD per month
  falseRejectionCount: integer("false_rejection_count"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const recruiterStatsTable = pgTable("recruiter_stats", {
  id: serial("id").primaryKey(),
  recruiterId: text("recruiter_id").notNull(),
  recruiterName: text("recruiter_name").notNull(),
  department: text("department"),
  totalDecisions: integer("total_decisions").notNull().default(0),
  rejectionRate: real("rejection_rate").notNull().default(0), // 0–100
  recoveryRate: real("recovery_rate").notNull().default(0),
  consistencyScore: integer("consistency_score").notNull().default(100), // 0–100
  zScore: real("z_score").notNull().default(0), // deviation from team average
  flagged: text("flagged"),        // null | inconsistent | bias_risk | overriding_rules
  snapshotDate: timestamp("snapshot_date", { withTimezone: true }).notNull().defaultNow(),
});

export const insertGovernanceSnapshotSchema = createInsertSchema(governanceSnapshotsTable).omit({ id: true, createdAt: true });
export type InsertGovernanceSnapshot = z.infer<typeof insertGovernanceSnapshotSchema>;
export type GovernanceSnapshot = typeof governanceSnapshotsTable.$inferSelect;

export const insertRecruiterStatSchema = createInsertSchema(recruiterStatsTable).omit({ id: true });
export type InsertRecruiterStat = z.infer<typeof insertRecruiterStatSchema>;
export type RecruiterStat = typeof recruiterStatsTable.$inferSelect;
