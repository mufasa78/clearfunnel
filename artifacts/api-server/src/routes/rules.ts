import { Router, type Request, type Response } from "express";
import {
  db, filterRulesTable, ruleHistoryTable, rolesTable,
  validationRunsTable, validationResultsTable, benchmarkResumesTable,
} from "@workspace/db";
import { eq, and, sql, inArray } from "drizzle-orm";
import { computeRuleAccuracy, computeValidationConfidence } from "../lib/algorithms.js";

const router = Router();

function formatRule(r: typeof filterRulesTable.$inferSelect, roleName?: string | null) {
  const { accuracy, fpRate, fnRate } = computeRuleAccuracy(
    r.triggeredCount, r.correctCount, r.falsePositiveCount, r.falseNegativeCount,
  );
  const riskLevel = fpRate > 40 ? "critical" : fpRate > 25 ? "high" : fpRate > 10 ? "medium" : "low";

  return {
    id: r.id, name: r.name, description: r.description,
    ruleType: r.ruleType, criteria: r.criteria,
    status: r.status, version: r.version,
    roleId: r.roleId, roleName: roleName ?? null,
    lastValidatedAt: r.lastValidatedAt?.toISOString() ?? null,
    validationStatus: r.validationStatus,
    createdBy: r.createdBy,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    // Performance metrics
    triggeredCount: r.triggeredCount,
    correctCount: r.correctCount,
    falsePositiveCount: r.falsePositiveCount,
    falseNegativeCount: r.falseNegativeCount,
    weightPercent: r.weightPercent,
    accuracyScore: accuracy,
    fpRate, fnRate,
    riskLevel,
    optimizerRecommendation: r.optimizerRecommendation,
  };
}

router.get("/rules", async (req: Request, res: Response): Promise<void> => {
  const { status, roleId } = req.query;
  let conditions: any[] = [];
  if (status) conditions.push(eq(filterRulesTable.status, status as string));
  if (roleId) conditions.push(eq(filterRulesTable.roleId, parseInt(roleId as string, 10)));

  const rules = conditions.length > 0
    ? await db.select().from(filterRulesTable).where(and(...conditions)).orderBy(filterRulesTable.updatedAt)
    : await db.select().from(filterRulesTable).orderBy(filterRulesTable.updatedAt);

  const roleIds = [...new Set(rules.map((r) => r.roleId).filter(Boolean) as number[])];
  const roles = roleIds.length > 0 ? await db.select().from(rolesTable).where(inArray(rolesTable.id, roleIds)) : [];
  const roleMap = new Map(roles.map((r) => [r.id, r.name]));

  // Team averages for benchmarking
  const totalTriggered = rules.reduce((s, r) => s + r.triggeredCount, 0);
  const avgAccuracy = rules.length > 0
    ? Math.round(rules.reduce((s, r) => {
        const acc = r.triggeredCount > 0 ? (r.correctCount / r.triggeredCount) * 100 : 100;
        return s + acc;
      }, 0) / rules.length)
    : 0;

  res.json({
    rules: rules.map((r) => formatRule(r, r.roleId ? roleMap.get(r.roleId) : null)),
    summary: {
      totalRules: rules.length,
      activeRules: rules.filter((r) => r.status === "active").length,
      avgAccuracy,
      totalTriggered,
      highRiskRules: rules.filter((r) => r.triggeredCount > 0 && (r.falsePositiveCount / r.triggeredCount) > 0.4).length,
      rulesNeedingAttention: rules.filter((r) => r.optimizerRecommendation !== null).length,
    },
  });
});

router.post("/rules", async (req: Request, res: Response): Promise<void> => {
  const { name, description, ruleType, criteria, roleId, createdBy, weightPercent } = req.body;
  if (!name || !description || !ruleType || !criteria || !createdBy) {
    res.status(400).json({ error: "name, description, ruleType, criteria, createdBy are required" }); return;
  }
  const [rule] = await db.insert(filterRulesTable).values({
    name, description, ruleType, criteria,
    roleId: roleId ?? null, createdBy,
    status: "pending_validation", version: 1, validationStatus: "not_run",
    weightPercent: weightPercent ?? 50,
  }).returning();

  await db.insert(ruleHistoryTable).values({ ruleId: rule.id, version: 1, changedBy: createdBy, changes: "Rule created" });
  res.status(201).json(formatRule(rule, null));
});

router.get("/rules/:id", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [rule] = await db.select().from(filterRulesTable).where(eq(filterRulesTable.id, id));
  if (!rule) { res.status(404).json({ error: "Not found" }); return; }

  const history = await db.select().from(ruleHistoryTable)
    .where(eq(ruleHistoryTable.ruleId, id)).orderBy(ruleHistoryTable.version);
  const validationRuns = await db.select().from(validationRunsTable)
    .where(eq(validationRunsTable.ruleId, id)).orderBy(sql`${validationRunsTable.startedAt} DESC`);

  let roleName: string | null = null;
  if (rule.roleId) {
    const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, rule.roleId));
    roleName = role?.name ?? null;
  }

  const enrichedRuns = await Promise.all(validationRuns.slice(0, 10).map(async (run) => {
    const results = await db.select().from(validationResultsTable)
      .where(eq(validationResultsTable.validationRunId, run.id));
    const historicalAccuracy = run.benchmarkCount > 0
      ? (run.passCount / run.benchmarkCount)
      : 0.75;
    const confidence = computeValidationConfidence(run.passCount, run.benchmarkCount, historicalAccuracy);
    return {
      id: run.id, ruleId: run.ruleId, status: run.status,
      benchmarkCount: run.benchmarkCount, passCount: run.passCount, failCount: run.failCount,
      passRate: run.benchmarkCount > 0 ? Math.round((run.passCount / run.benchmarkCount) * 100) : 0,
      validationConfidence: confidence,
      startedAt: run.startedAt.toISOString(),
      completedAt: run.completedAt?.toISOString() ?? null,
      results: results.map((r) => ({
        benchmarkResumeId: r.benchmarkResumeId, candidateName: r.candidateName,
        expectedOutcome: r.expectedOutcome, actualOutcome: r.actualOutcome,
        passed: r.passed, failReason: r.failReason,
      })),
    };
  }));

  res.json({
    rule: formatRule(rule, roleName),
    history: history.map((h) => ({ version: h.version, changedBy: h.changedBy, changes: h.changes, changedAt: h.changedAt.toISOString() })),
    validationRuns: enrichedRuns,
  });
});

router.patch("/rules/:id", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [existing] = await db.select().from(filterRulesTable).where(eq(filterRulesTable.id, id));
  if (!existing) { res.status(404).json({ error: "Not found" }); return; }

  const { name, description, criteria, status, changedBy, weightPercent } = req.body;
  const newVersion = existing.version + 1;
  const changes = [
    name && name !== existing.name ? `name: "${existing.name}" → "${name}"` : null,
    description && description !== existing.description ? "description updated" : null,
    criteria && criteria !== existing.criteria ? "criteria updated" : null,
    status && status !== existing.status ? `status: ${existing.status} → ${status}` : null,
    weightPercent !== undefined && weightPercent !== existing.weightPercent ? `weight: ${existing.weightPercent}% → ${weightPercent}%` : null,
  ].filter(Boolean).join("; ");

  const [updated] = await db.update(filterRulesTable).set({
    ...(name && { name }),
    ...(description && { description }),
    ...(criteria && { criteria }),
    ...(status && { status }),
    ...(weightPercent !== undefined && { weightPercent }),
    version: newVersion,
    validationStatus: "not_run",
  }).where(eq(filterRulesTable.id, id)).returning();

  if (changes) {
    await db.insert(ruleHistoryTable).values({
      ruleId: id, version: newVersion,
      changedBy: changedBy ?? "system", changes: changes || "Updated",
    });
  }

  res.json(formatRule(updated, null));
});

router.post("/rules/:id/validate", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const ruleId = parseInt(raw, 10);

  const [rule] = await db.select().from(filterRulesTable).where(eq(filterRulesTable.id, ruleId));
  if (!rule) { res.status(404).json({ error: "Not found" }); return; }

  const benchmarks = await db.select().from(benchmarkResumesTable);
  if (benchmarks.length === 0) { res.status(400).json({ error: "No benchmark resumes available" }); return; }

  // Simulate validation based on rule's historical accuracy
  const { accuracy } = computeRuleAccuracy(rule.triggeredCount, rule.correctCount, rule.falsePositiveCount, rule.falseNegativeCount);
  const passRate = Math.min(0.95, Math.max(0.2, accuracy / 100));

  let passCount = 0, failCount = 0;
  const results: any[] = [];

  for (const b of benchmarks) {
    const passed = Math.random() < passRate;
    if (passed) passCount++; else failCount++;
    const failReason = !passed ? `Rule "${rule.name}" triggered incorrectly for this profile` : null;
    results.push({ benchmarkResumeId: b.id, candidateName: b.candidateName, expectedOutcome: b.expectedOutcome, actualOutcome: passed ? b.expectedOutcome : (b.expectedOutcome === "pass" ? "fail" : "pass"), passed, failReason });
  }

  const overallStatus = failCount > Math.floor(benchmarks.length * 0.3) ? "failed" : "passed";
  const [run] = await db.insert(validationRunsTable).values({
    ruleId, status: overallStatus, benchmarkCount: benchmarks.length,
    passCount, failCount, startedAt: new Date(), completedAt: new Date(),
  }).returning();

  if (results.length > 0) {
    await db.insert(validationResultsTable).values(results.map((r) => ({
      validationRunId: run.id, benchmarkResumeId: r.benchmarkResumeId,
      candidateName: r.candidateName, expectedOutcome: r.expectedOutcome,
      actualOutcome: r.actualOutcome, passed: r.passed, failReason: r.failReason ?? null,
    })));
  }

  await db.update(filterRulesTable).set({
    lastValidatedAt: new Date(), validationStatus: overallStatus,
    status: overallStatus === "passed" ? "active" : "pending_validation",
  }).where(eq(filterRulesTable.id, ruleId));

  const confidence = computeValidationConfidence(passCount, benchmarks.length, accuracy / 100);
  res.status(201).json({
    id: run.id, ruleId: run.ruleId, ruleName: rule.name, status: run.status,
    benchmarkCount: run.benchmarkCount, passCount: run.passCount, failCount: run.failCount,
    passRate: Math.round((passCount / benchmarks.length) * 100),
    validationConfidence: confidence,
    startedAt: run.startedAt.toISOString(), completedAt: run.completedAt?.toISOString() ?? null,
  });
});

export default router;
