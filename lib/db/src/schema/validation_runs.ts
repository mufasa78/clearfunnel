import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { filterRulesTable } from "./rules";
import { benchmarkResumesTable } from "./benchmark_resumes";

export const validationRunsTable = pgTable("validation_runs", {
  id: serial("id").primaryKey(),
  ruleId: integer("rule_id").notNull().references(() => filterRulesTable.id),
  status: text("status").notNull().default("pending"), // pending | running | passed | failed
  benchmarkCount: integer("benchmark_count").notNull().default(0),
  passCount: integer("pass_count").notNull().default(0),
  failCount: integer("fail_count").notNull().default(0),
  overrideJustification: text("override_justification"),
  overriddenBy: text("overridden_by"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const validationResultsTable = pgTable("validation_results", {
  id: serial("id").primaryKey(),
  validationRunId: integer("validation_run_id").notNull().references(() => validationRunsTable.id),
  benchmarkResumeId: integer("benchmark_resume_id").notNull().references(() => benchmarkResumesTable.id),
  candidateName: text("candidate_name").notNull(),
  expectedOutcome: text("expected_outcome").notNull(), // pass | fail
  actualOutcome: text("actual_outcome").notNull(), // pass | fail
  passed: boolean("passed").notNull(),
  failReason: text("fail_reason"),
});

export const insertValidationRunSchema = createInsertSchema(validationRunsTable).omit({ id: true, startedAt: true });
export type InsertValidationRun = z.infer<typeof insertValidationRunSchema>;
export type ValidationRun = typeof validationRunsTable.$inferSelect;
export type ValidationResult = typeof validationResultsTable.$inferSelect;
