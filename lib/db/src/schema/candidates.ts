import { pgTable, text, serial, timestamp, integer, boolean, real } from "drizzle-orm/pg-core";
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

  // Intelligence fields
  recoveryScore: integer("recovery_score"),          // 0–100 composite score
  skillMatch: integer("skill_match"),                // 0–100 % match to job skills
  experienceMatch: integer("experience_match"),      // 0–100 % match to experience req
  educationMatch: integer("education_match"),        // 0–100 % match to education req
  rejectionConfidence: integer("rejection_confidence"), // 0–100 ATS confidence this was correct
  yearsExperience: integer("years_experience"),
  educationLevel: text("education_level"),           // high_school | bachelors | masters | phd
  skills: text("skills").array().notNull().default([]),
  department: text("department"),
  similarityWarning: text("similarity_warning"),     // e.g. "87% similar to 3 top performers"
  recruiterRecommendation: text("recruiter_recommendation"), // recover | review | reject
});

export const insertCandidateSchema = createInsertSchema(candidatesTable).omit({ id: true, createdAt: true });
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidatesTable.$inferSelect;
