import { Router, type Request, type Response } from "express";
import { db, candidatesTable, decisionsTable, decisionRulesTable, rolesTable, filterRulesTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { computeRecoveryScore, recoveryRecommendation, cosineSimilarity } from "../lib/algorithms.js";

const router = Router();

async function enrichCandidate(c: typeof candidatesTable.$inferSelect) {
  const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, c.roleId));
  const [latestDecision] = await db.select().from(decisionsTable)
    .where(eq(decisionsTable.candidateId, c.id))
    .orderBy(decisionsTable.rejectedAt);

  // Compute or use stored recovery score
  const skillMatch = c.skillMatch ?? 0;
  const experienceMatch = c.experienceMatch ?? 0;
  const educationMatch = c.educationMatch ?? 0;
  const rejectionConfidence = c.rejectionConfidence ?? 70;

  const recoveryScore = c.recoveryScore ?? computeRecoveryScore(skillMatch, experienceMatch, educationMatch, rejectionConfidence);
  const recommendation = recoveryRecommendation(recoveryScore);

  return {
    id: c.id,
    name: c.name,
    email: c.email,
    roleId: c.roleId,
    roleName: role?.name ?? "Unknown",
    department: c.department ?? role?.department ?? null,
    rejectionSummary: latestDecision?.rejectionSummary ?? "Auto-rejected by ATS filter",
    rejectedAt: c.rejectedAt.toISOString(),
    recovered: c.recovered,
    recoveredAt: c.recoveredAt?.toISOString() ?? null,
    recoveredBy: c.recoveredBy,
    recoveryReason: c.recoveryReason,
    retentionExpiresAt: c.retentionExpiresAt.toISOString(),

    // Intelligence fields
    recoveryScore,
    skillMatch,
    experienceMatch,
    educationMatch,
    rejectionConfidence,
    yearsExperience: c.yearsExperience,
    educationLevel: c.educationLevel,
    skills: c.skills,
    recruiterRecommendation: recommendation,
    similarityWarning: c.similarityWarning,
  };
}

router.get("/candidates", async (req: Request, res: Response): Promise<void> => {
  const { roleId, recovered, search } = req.query;

  let candidates = await db.select().from(candidatesTable).orderBy(sql`${candidatesTable.recoveryScore} DESC NULLS LAST`);

  if (roleId) candidates = candidates.filter((c) => c.roleId === parseInt(roleId as string, 10));
  if (typeof recovered !== "undefined") {
    const isRecovered = recovered === "true";
    candidates = candidates.filter((c) => c.recovered === isRecovered);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    candidates = candidates.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }

  // Only show candidates within retention window
  const now = new Date();
  candidates = candidates.filter((c) => c.retentionExpiresAt > now);

  const result = await Promise.all(candidates.map(enrichCandidate));
  res.json(result);
});

router.get("/candidates/:id", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.id, id));
  if (!candidate) { res.status(404).json({ error: "Not found" }); return; }

  const decisions = await db.select().from(decisionsTable)
    .where(eq(decisionsTable.candidateId, id))
    .orderBy(decisionsTable.rejectedAt);

  const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, candidate.roleId));

  const enrichedDecisions = await Promise.all(decisions.map(async (d) => {
    const rules = await db.select().from(decisionRulesTable).where(eq(decisionRulesTable.decisionId, d.id));
    return {
      id: d.id, candidateId: d.candidateId, candidateName: candidate.name,
      roleId: d.roleId, roleName: role?.name ?? "Unknown",
      triggeredRules: rules.map((r) => ({ ruleId: r.ruleId, ruleName: r.ruleName, ruleDescription: r.ruleDescription })),
      rejectionSummary: d.rejectionSummary,
      rejectedAt: d.rejectedAt.toISOString(),
      recoverable: d.recoverable, recovered: d.recovered,
      recoveredAt: d.recoveredAt?.toISOString() ?? null, recoveredBy: d.recoveredBy,
      confidenceScore: d.confidenceScore,
      evidenceStrength: d.evidenceStrength,
      evidenceCount: d.evidenceCount,
    };
  }));

  // Score breakdown for explainability
  const skillMatch = candidate.skillMatch ?? 0;
  const experienceMatch = candidate.experienceMatch ?? 0;
  const educationMatch = candidate.educationMatch ?? 0;
  const rejectionConfidence = candidate.rejectionConfidence ?? 70;

  const recoveryScore = candidate.recoveryScore ??
    computeRecoveryScore(skillMatch, experienceMatch, educationMatch, rejectionConfidence);

  res.json({
    candidate: await enrichCandidate(candidate),
    decisions: enrichedDecisions,
    scoreBreakdown: {
      recoveryScore,
      components: [
        { label: "Skill Match", value: skillMatch, weight: 35, contribution: Math.round(skillMatch * 0.35) },
        { label: "Experience Match", value: experienceMatch, weight: 30, contribution: Math.round(experienceMatch * 0.30) },
        { label: "Education Match", value: educationMatch, weight: 20, contribution: Math.round(educationMatch * 0.20) },
        { label: "ATS Confidence Inverse", value: 100 - rejectionConfidence, weight: 15, contribution: Math.round((100 - rejectionConfidence) * 0.15) },
      ],
      recommendation: recoveryRecommendation(recoveryScore),
      explanation: recoveryScore >= 75
        ? "Strong evidence of wrongful rejection. High skill and experience alignment with low ATS confidence."
        : recoveryScore >= 50
        ? "Borderline case. Manual review recommended before making final determination."
        : "Rejection appears justified based on available evidence.",
    },
  });
});

router.post("/candidates/:id/recover", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.id, id));
  if (!candidate) { res.status(404).json({ error: "Not found" }); return; }

  const { recoveredBy, reason } = req.body;
  if (!recoveredBy || !reason) { res.status(400).json({ error: "recoveredBy and reason are required" }); return; }

  const [updated] = await db.update(candidatesTable).set({
    recovered: true, recoveredAt: new Date(), recoveredBy, recoveryReason: reason,
  }).where(eq(candidatesTable.id, id)).returning();

  await db.update(decisionsTable).set({
    recovered: true, recoveredAt: new Date(), recoveredBy,
  }).where(eq(decisionsTable.candidateId, id));

  res.json(await enrichCandidate(updated));
});

export default router;
