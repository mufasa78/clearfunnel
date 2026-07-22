import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const benchmarkResumesTable = pgTable("benchmark_resumes", {
  id: serial("id").primaryKey(),
  candidateName: text("candidate_name").notNull(),
  scenario: text("scenario").notNull(),
  expectedOutcome: text("expected_outcome").notNull(), // pass | fail
  background: text("background").notNull(),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBenchmarkResumeSchema = createInsertSchema(benchmarkResumesTable).omit({ id: true, createdAt: true });
export type InsertBenchmarkResume = z.infer<typeof insertBenchmarkResumeSchema>;
export type BenchmarkResume = typeof benchmarkResumesTable.$inferSelect;
