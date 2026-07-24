import { Router, type Request, type Response } from "express";
import {
  db, decisionsTable, candidatesTable, alertsTable, filterRulesTable,
  validationRunsTable, rolesTable, decisionRulesTable, governanceSnapshotsTable,
} from "@workspace/db";
import { eq, sql, count, and } from "drizzle-orm";
import {
  computeGovernanceScore, computeATSHealthScore, computeFinancialImpact,
  governanceLabel, stdDev, mean,
} from "../lib/algorithms.js";

const router = Router();

router.get("/dashboard/summary", async (req: Request, res: Response): Promise<void> => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);

  // Core counts
  const [totalRejectionsRow] = await db.select({ cnt: count() }).from(decisionsTable);
  const [todayRejectionsRow] = await db.select({ cnt: count() }).from(decisionsTable)
    .where(sql`${decisionsTable.rejectedAt} >= ${todayStart}`);
  const [recoverableRow] = await db.select({ cnt: count() }).from(candidatesTable)
    .where(and(eq(candidatesTable.recovered, false), sql`${candidatesTable.retentionExpiresAt} > NOW()`));
  const [openAlertsRow] = await db.select({ cnt: count() }).from(alertsTable)
    .where(eq(alertsTable.status, "open"));
  const [activeRulesRow] = await db.select({ cnt: count() }).from(filterRulesTable)
    .where(eq(filterRulesTable.status, "active"));
  const [pendingValRow] = await db.select({ cnt: count() }).from(filterRulesTable)
    .where(eq(filterRulesTable.status, "pending_validation"));
  const [totalRunsRow] = await db.select({ cnt: count() }).from(validationRunsTable);
  const [passedRunsRow] = await db.select({ cnt: count() }).from(validationRunsTable)
    .where(eq(validationRunsTable.status, "passed"));
  const [recoveredRow] = await db.select({ cnt: count() }).from(candidatesTable)
    .where(eq(candidatesTable.recovered, true));

  const totalRejections = Number(totalRejectionsRow?.cnt ?? 0);
  const todayRejections = Number(todayRejectionsRow?.cnt ?? 0);
  const totalRuns = Number(totalRunsRow?.cnt ?? 0);
  const passedRuns = Number(passedRunsRow?.cnt ?? 0);
  const recoveredCount = Number(recoveredRow?.cnt ?? 0);
  const recoverableCount = Number(recoverableRow?.cnt ?? 0);

  // Governance score — use latest snapshot or compute fresh
  const [latestSnapshot] = await db.select()
    .from(governanceSnapshotsTable)
    .orderBy(sql`${governanceSnapshotsTable.snapshotDate} DESC`)
    .limit(1);

  const governanceScore = latestSnapshot?.governanceScore ?? 0;
  const atsHealthScore = latestSnapshot?.atsHealthScore ?? 0;
  const { label: govLabel } = governanceLabel(governanceScore);

  // Financial impact
  const falseRejectionCount = latestSnapshot?.falseRejectionCount ?? 0;
  const { totalCost, talentLossCost, recruiterReworkCost } = computeFinancialImpact(falseRejectionCount);

  // Recovery success rate
  const totalEver = recoveredCount + recoverableCount;
  const recoverySuccessRate = totalEver > 0
    ? Math.round((recoveredCount / totalEver) * 100)
    : 0;

  // Rule performance summary
  const rules = await db.select().from(filterRulesTable).where(eq(filterRulesTable.status, "active"));
  const avgRuleAccuracy = rules.length > 0
    ? Math.round(rules.reduce((sum, r) => {
        const acc = r.triggeredCount > 0 ? (r.correctCount / r.triggeredCount) * 100 : 100;
        return sum + acc;
      }, 0) / rules.length)
    : 0;
  const highRiskRules = rules.filter((r) =>
    r.triggeredCount > 0 && (r.falsePositiveCount / r.triggeredCount) > 0.4
  ).length;

  // Recent decisions with confidence
  const recentDecisions = await db.select().from(decisionsTable)
    .orderBy(sql`${decisionsTable.rejectedAt} DESC`).limit(5);
  const enrichedDecisions = await Promise.all(recentDecisions.map(async (d) => {
    const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.id, d.candidateId));
    const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, d.roleId));
    const rules = await db.select().from(decisionRulesTable).where(eq(decisionRulesTable.decisionId, d.id));
    return {
      id: d.id, candidateId: d.candidateId,
      candidateName: candidate?.name ?? "Unknown",
      roleId: d.roleId, roleName: role?.name ?? "Unknown",
      triggeredRules: rules.map((r) => ({ ruleId: r.ruleId, ruleName: r.ruleName, ruleDescription: r.ruleDescription })),
      rejectionSummary: d.rejectionSummary,
      rejectedAt: d.rejectedAt.toISOString(),
      recoverable: d.recoverable, recovered: d.recovered,
      recoveredAt: d.recoveredAt?.toISOString() ?? null,
      recoveredBy: d.recoveredBy,
      confidenceScore: d.confidenceScore,
      evidenceStrength: d.evidenceStrength,
    };
  }));

  // Recent alerts
  const recentAlerts = await db.select().from(alertsTable)
    .where(eq(alertsTable.status, "open"))
    .orderBy(sql`${alertsTable.detectedAt} DESC`).limit(5);
  const alertsWithRoles = await Promise.all(recentAlerts.map(async (a) => {
    const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, a.roleId));
    return {
      id: a.id, roleId: a.roleId, roleName: role?.name ?? "Unknown",
      alertType: a.alertType, severity: a.severity, message: a.message,
      correlatedRuleId: a.correlatedRuleId, correlatedRuleName: a.correlatedRuleName,
      status: a.status, detectedAt: a.detectedAt.toISOString(),
      resolvedAt: a.resolvedAt?.toISOString() ?? null, resolvedBy: a.resolvedBy,
      zScore: a.zScore, baselineRate: a.baselineRate, currentRate: a.currentRate,
      affectedCandidates: a.affectedCandidates,
    };
  }));

  res.json({
    // Core metrics
    totalRejections,
    rejectionRateToday: totalRejections > 0 ? Math.round((todayRejections / Math.max(totalRejections, 1)) * 100) : 0,
    recoverableCandidates: recoverableCount,
    openAlerts: Number(openAlertsRow?.cnt ?? 0),
    activeRules: Number(activeRulesRow?.cnt ?? 0),
    pendingValidations: Number(pendingValRow?.cnt ?? 0),
    validationPassRate: totalRuns > 0 ? Math.round((passedRuns / totalRuns) * 100) : 0,

    // Intelligence scores
    governanceScore,
    atsHealthScore,
    governanceLabel: govLabel,
    avgRuleAccuracy,
    highRiskRules,
    recoverySuccessRate,

    // Financial impact
    estimatedRevenueLost: totalCost,
    talentLossCost,
    recruiterReworkCost,
    falseRejectionCount,

    // Governance components
    governanceComponents: latestSnapshot ? {
      ruleAccuracy: latestSnapshot.ruleAccuracy,
      falseRejectionRate: latestSnapshot.falseRejectionRate,
      recoverySuccessRate: latestSnapshot.recoverySuccessRate,
      recruiterConsistency: latestSnapshot.recruiterConsistency,
      explainabilityCoverage: latestSnapshot.explainabilityCoverage,
      biasRisk: latestSnapshot.biasRisk,
      validationPassRate: latestSnapshot.validationPassRate,
    } : null,

    recentDecisions: enrichedDecisions,
    recentAlerts: alertsWithRoles,
  });
});

router.get("/dashboard/rejection-rates", async (req: Request, res: Response): Promise<void> => {
  const { days = "30" } = req.query;
  const daysNum = parseInt(days as string, 10);
  const since = new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000);

  const decisions = await db.select().from(decisionsTable)
    .where(sql`${decisionsTable.rejectedAt} >= ${since}`);

  const roles = await db.select().from(rolesTable);
  const roleMap = new Map(roles.map((r) => [r.id, r.name]));

  const grouped = new Map<string, { date: string; roleId: number; roleName: string; totalRejections: number; totalApplications: number; avgConfidence: number; confidenceSum: number }>();
  for (const d of decisions) {
    const dateStr = d.rejectedAt.toISOString().split("T")[0];
    const key = `${dateStr}-${d.roleId}`;
    if (!grouped.has(key)) {
      grouped.set(key, { date: dateStr, roleId: d.roleId, roleName: roleMap.get(d.roleId) ?? "Unknown", totalRejections: 0, totalApplications: 0, avgConfidence: 0, confidenceSum: 0 });
    }
    const entry = grouped.get(key)!;
    entry.totalRejections++;
    entry.totalApplications = Math.ceil(entry.totalRejections / 0.72);
    entry.confidenceSum += d.confidenceScore ?? 75;
    entry.avgConfidence = Math.round(entry.confidenceSum / entry.totalRejections);
  }

  const result = Array.from(grouped.values()).map((g) => ({
    date: g.date, roleId: g.roleId, roleName: g.roleName,
    rejectionRate: Math.round((g.totalRejections / g.totalApplications) * 100 * 10) / 10,
    totalApplications: g.totalApplications, totalRejections: g.totalRejections,
    avgConfidence: g.avgConfidence,
  }));
  result.sort((a, b) => a.date.localeCompare(b.date));
  res.json(result);
});

router.get("/dashboard/rule-impact", async (req: Request, res: Response): Promise<void> => {
  const ruleRows = await db.select({
    ruleId: decisionRulesTable.ruleId,
    ruleName: decisionRulesTable.ruleName,
    cnt: count(),
  }).from(decisionRulesTable).groupBy(decisionRulesTable.ruleId, decisionRulesTable.ruleName);

  const [totalRow] = await db.select({ cnt: count() }).from(decisionsTable);
  const total = Number(totalRow?.cnt ?? 0);

  const rules = await db.select().from(filterRulesTable);
  const ruleMap = new Map(rules.map((r) => [r.id, r]));

  const result = ruleRows.map((r) => {
    const rule = ruleMap.get(r.ruleId);
    const triggered = rule?.triggeredCount ?? 0;
    const correct = rule?.correctCount ?? 0;
    const fp = rule?.falsePositiveCount ?? 0;
    const accuracy = triggered > 0 ? Math.round((correct / triggered) * 100) : 100;
    return {
      ruleId: r.ruleId,
      ruleName: r.ruleName,
      ruleType: rule?.ruleType ?? "custom",
      totalRejections: Number(r.cnt),
      percentageOfAll: total > 0 ? Math.round((Number(r.cnt) / total) * 100 * 10) / 10 : 0,
      accuracyScore: accuracy,
      falsePositiveCount: fp,
      fpRate: triggered > 0 ? Math.round((fp / triggered) * 100) : 0,
      optimizerRecommendation: rule?.optimizerRecommendation ?? null,
    };
  });
  result.sort((a, b) => b.totalRejections - a.totalRejections);
  res.json(result);
});

export default router;
