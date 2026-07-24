import { Router, type Request, type Response } from "express";
import {
  db, governanceSnapshotsTable, recruiterStatsTable,
  filterRulesTable, decisionsTable, candidatesTable,
  alertsTable, validationRunsTable,
} from "@workspace/db";
import { eq, sql, count, and } from "drizzle-orm";
import {
  computeGovernanceScore, computeATSHealthScore, computeFinancialImpact,
  computeBiasRisk, stdDev, mean,
} from "../lib/algorithms.js";

const router = Router();

// GET /api/governance/score — current governance score with breakdown
router.get("/governance/score", async (_req: Request, res: Response): Promise<void> => {
  // Fetch latest snapshot for trend, or compute fresh
  const snapshots = await db.select()
    .from(governanceSnapshotsTable)
    .orderBy(sql`${governanceSnapshotsTable.snapshotDate} DESC`)
    .limit(12);

  if (snapshots.length === 0) {
    res.json({
      governanceScore: 0,
      atsHealthScore: 0,
      components: {},
      trend: [],
      financialImpact: { talentLossCost: 0, recruiterReworkCost: 0, totalCost: 0 },
    });
    return;
  }

  const latest = snapshots[0];
  const financial = computeFinancialImpact(latest.falseRejectionCount ?? 0);

  res.json({
    governanceScore: latest.governanceScore,
    atsHealthScore: latest.atsHealthScore,
    components: {
      ruleAccuracy: latest.ruleAccuracy,
      falseRejectionRate: latest.falseRejectionRate,
      recoverySuccessRate: latest.recoverySuccessRate,
      recruiterConsistency: latest.recruiterConsistency,
      explainabilityCoverage: latest.explainabilityCoverage,
      biasRisk: latest.biasRisk,
      validationPassRate: latest.validationPassRate,
    },
    trend: snapshots.reverse().map((s) => ({
      date: s.snapshotDate.toISOString().split("T")[0],
      governanceScore: s.governanceScore,
      atsHealthScore: s.atsHealthScore,
    })),
    financialImpact: financial,
    estimatedRevenueLost: latest.estimatedRevenueLost ?? 0,
    falseRejectionCount: latest.falseRejectionCount ?? 0,
  });
});

// GET /api/governance/recruiter-stats — recruiter consistency analysis
router.get("/governance/recruiter-stats", async (_req: Request, res: Response): Promise<void> => {
  const stats = await db.select()
    .from(recruiterStatsTable)
    .orderBy(sql`${recruiterStatsTable.snapshotDate} DESC`);

  // Deduplicate: latest per recruiterId
  const seen = new Set<string>();
  const latest = stats.filter((s) => {
    if (seen.has(s.recruiterId)) return false;
    seen.add(s.recruiterId);
    return true;
  });

  const rates = latest.map((s) => s.rejectionRate);
  const teamMean = mean(rates);
  const teamStdDev = stdDev(rates);
  const teamConsistency = Math.round(100 - teamStdDev * 2);

  res.json({
    teamMeanRejectionRate: Math.round(teamMean * 10) / 10,
    teamStdDev: Math.round(teamStdDev * 10) / 10,
    teamConsistencyScore: Math.max(0, Math.min(100, teamConsistency)),
    recruiters: latest.map((s) => ({
      recruiterId: s.recruiterId,
      recruiterName: s.recruiterName,
      department: s.department,
      totalDecisions: s.totalDecisions,
      rejectionRate: s.rejectionRate,
      recoveryRate: s.recoveryRate,
      consistencyScore: s.consistencyScore,
      zScore: s.zScore,
      flagged: s.flagged,
    })),
  });
});

// GET /api/governance/bias-analysis — bias risk breakdown
router.get("/governance/bias-analysis", async (_req: Request, res: Response): Promise<void> => {
  const candidates = await db.select({
    educationLevel: candidatesTable.educationLevel,
    recovered: candidatesTable.recovered,
  }).from(candidatesTable);

  // Group by education level as proxy dimension
  const groups: Record<string, { total: number; rejected: number }> = {};
  for (const c of candidates) {
    const key = c.educationLevel ?? "unknown";
    if (!groups[key]) groups[key] = { total: 0, rejected: 0 };
    groups[key].total++;
    if (!c.recovered) groups[key].rejected++;
  }

  const breakdown = Object.entries(groups).map(([label, g]) => ({
    group: label,
    total: g.total,
    rejectionRate: g.total > 0 ? Math.round((g.rejected / g.total) * 100) : 0,
  }));

  const rates = breakdown.map((b) => b.rejectionRate);
  const biasRisk = computeBiasRisk(rates);

  res.json({
    biasRisk,
    dimensions: [
      {
        name: "Education Level",
        risk: biasRisk,
        breakdown,
      },
    ],
  });
});

export default router;
