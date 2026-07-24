import { Router, type Request, type Response } from "express";
import { db, decisionsTable, decisionRulesTable, candidatesTable, rolesTable, filterRulesTable } from "@workspace/db";
import { eq, sql, count } from "drizzle-orm";
import { evidenceStrength } from "../lib/algorithms.js";

const router = Router();

async function enrichDecision(d: typeof decisionsTable.$inferSelect) {
  const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.id, d.candidateId));
  const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, d.roleId));
  const rules = await db.select().from(decisionRulesTable).where(eq(decisionRulesTable.decisionId, d.id));

  // Enrich each triggered rule with its performance stats
  const enrichedRules = await Promise.all(rules.map(async (r) => {
    const [ruleData] = await db.select().from(filterRulesTable).where(eq(filterRulesTable.id, r.ruleId));
    const accuracy = ruleData && ruleData.triggeredCount > 0
      ? Math.round((ruleData.correctCount / ruleData.triggeredCount) * 100)
      : null;
    return {
      ruleId: r.ruleId,
      ruleName: r.ruleName,
      ruleDescription: r.ruleDescription,
      ruleAccuracy: accuracy,
      fpRate: ruleData && ruleData.triggeredCount > 0
        ? Math.round((ruleData.falsePositiveCount / ruleData.triggeredCount) * 100)
        : null,
      weightPercent: ruleData?.weightPercent ?? null,
    };
  }));

  return {
    id: d.id,
    candidateId: d.candidateId,
    candidateName: candidate?.name ?? "Unknown",
    roleId: d.roleId,
    roleName: role?.name ?? "Unknown",
    triggeredRules: enrichedRules,
    rejectionSummary: d.rejectionSummary,
    rejectedAt: d.rejectedAt.toISOString(),
    recoverable: d.recoverable,
    recovered: d.recovered,
    recoveredAt: d.recoveredAt?.toISOString() ?? null,
    recoveredBy: d.recoveredBy,
    // Intelligence fields
    confidenceScore: d.confidenceScore,
    evidenceStrength: d.evidenceStrength ?? (d.confidenceScore ? evidenceStrength(d.confidenceScore) : null),
    evidenceCount: d.evidenceCount ?? rules.length,
    recruiterId: d.recruiterId,
  };
}

router.get("/decisions", async (req: Request, res: Response): Promise<void> => {
  const { roleId, recovered, limit = "50", offset = "0" } = req.query;

  let allDecisions = await db.select().from(decisionsTable)
    .orderBy(sql`${decisionsTable.rejectedAt} DESC`)
    .limit(parseInt(limit as string, 10))
    .offset(parseInt(offset as string, 10));

  if (roleId) allDecisions = allDecisions.filter((d) => d.roleId === parseInt(roleId as string, 10));
  if (typeof recovered !== "undefined") {
    const isRecovered = recovered === "true";
    allDecisions = allDecisions.filter((d) => d.recovered === isRecovered);
  }

  const [totalRow] = await db.select({ cnt: count() }).from(decisionsTable);
  const [strongRow] = await db.select({ cnt: count() }).from(decisionsTable)
    .where(sql`${decisionsTable.confidenceScore} >= 85`);
  const [weakRow] = await db.select({ cnt: count() }).from(decisionsTable)
    .where(sql`${decisionsTable.confidenceScore} < 65`);

  const result = await Promise.all(allDecisions.map(enrichDecision));

  // Confidence distribution for the UI
  const avgConfidence = result.length > 0
    ? Math.round(result.reduce((s, d) => s + (d.confidenceScore ?? 75), 0) / result.length)
    : 0;

  res.json({
    decisions: result,
    total: Number(totalRow?.cnt ?? 0),
    summary: {
      avgConfidence,
      strongDecisions: Number(strongRow?.cnt ?? 0),
      weakDecisions: Number(weakRow?.cnt ?? 0),
      strongPct: Number(totalRow?.cnt) > 0 ? Math.round(Number(strongRow?.cnt) / Number(totalRow?.cnt) * 100) : 0,
      weakPct: Number(totalRow?.cnt) > 0 ? Math.round(Number(weakRow?.cnt) / Number(totalRow?.cnt) * 100) : 0,
    },
  });
});

export default router;
