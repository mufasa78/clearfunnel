import { Router, type Request, type Response } from "express";
import { db, validationRunsTable, validationResultsTable, filterRulesTable } from "@workspace/db";
import { eq, and, inArray } from "drizzle-orm";

const router = Router();

router.get("/validation-runs", async (req: Request, res: Response): Promise<void> => {
  const { ruleId, status } = req.query;

  let conditions: any[] = [];
  if (ruleId) conditions.push(eq(validationRunsTable.ruleId, parseInt(ruleId as string, 10)));
  if (status) conditions.push(eq(validationRunsTable.status, status as string));

  const runs = conditions.length > 0
    ? await db.select().from(validationRunsTable).where(and(...conditions)).orderBy(validationRunsTable.startedAt)
    : await db.select().from(validationRunsTable).orderBy(validationRunsTable.startedAt);

  const ruleIds = [...new Set(runs.map((r) => r.ruleId))];
  const rules = ruleIds.length > 0
    ? await db.select().from(filterRulesTable).where(inArray(filterRulesTable.id, ruleIds))
    : [];
  const ruleMap = new Map(rules.map((r) => [r.id, r.name]));

  res.json(runs.map((r) => ({
    id: r.id,
    ruleId: r.ruleId,
    ruleName: ruleMap.get(r.ruleId) ?? "Unknown Rule",
    status: r.status,
    benchmarkCount: r.benchmarkCount,
    passCount: r.passCount,
    failCount: r.failCount,
    overrideJustification: r.overrideJustification,
    overriddenBy: r.overriddenBy,
    startedAt: r.startedAt.toISOString(),
    completedAt: r.completedAt?.toISOString() ?? null,
  })));
});

router.get("/validation-runs/:id", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [run] = await db.select().from(validationRunsTable).where(eq(validationRunsTable.id, id));
  if (!run) { res.status(404).json({ error: "Not found" }); return; }

  const [rule] = await db.select().from(filterRulesTable).where(eq(filterRulesTable.id, run.ruleId));
  const results = await db.select().from(validationResultsTable).where(eq(validationResultsTable.validationRunId, id));

  res.json({
    run: {
      id: run.id,
      ruleId: run.ruleId,
      ruleName: rule?.name ?? "Unknown Rule",
      status: run.status,
      benchmarkCount: run.benchmarkCount,
      passCount: run.passCount,
      failCount: run.failCount,
      overrideJustification: run.overrideJustification,
      overriddenBy: run.overriddenBy,
      startedAt: run.startedAt.toISOString(),
      completedAt: run.completedAt?.toISOString() ?? null,
    },
    results: results.map((r) => ({
      id: r.id,
      benchmarkResumeId: r.benchmarkResumeId,
      candidateName: r.candidateName,
      expectedOutcome: r.expectedOutcome,
      actualOutcome: r.actualOutcome,
      passed: r.passed,
      failReason: r.failReason,
    })),
  });
});

export default router;
