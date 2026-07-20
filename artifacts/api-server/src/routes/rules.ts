import { Router, type IRouter } from "express";
import { db, filterRulesTable, ruleHistoryTable, rolesTable, validationRunsTable, validationResultsTable, benchmarkResumesTable } from "@workspace/db";
import { eq, and, sql, inArray } from "drizzle-orm";

const router: IRouter = Router();

router.get("/rules", async (req, res): Promise<void> => {
  const { status, roleId } = req.query;

  let conditions: any[] = [];
  if (status) conditions.push(eq(filterRulesTable.status, status as string));
  if (roleId) conditions.push(eq(filterRulesTable.roleId, parseInt(roleId as string, 10)));

  const rules = conditions.length > 0
    ? await db.select().from(filterRulesTable).where(and(...conditions)).orderBy(filterRulesTable.updatedAt)
    : await db.select().from(filterRulesTable).orderBy(filterRulesTable.updatedAt);

  const roleIds = [...new Set(rules.map((r) => r.roleId).filter(Boolean) as number[])];
  const roles = roleIds.length > 0
    ? await db.select().from(rolesTable).where(inArray(rolesTable.id, roleIds))
    : [];
  const roleMap = new Map(roles.map((r) => [r.id, r.name]));

  res.json(rules.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    ruleType: r.ruleType,
    criteria: r.criteria,
    status: r.status,
    version: r.version,
    roleId: r.roleId,
    roleName: r.roleId ? (roleMap.get(r.roleId) ?? null) : null,
    lastValidatedAt: r.lastValidatedAt?.toISOString() ?? null,
    validationStatus: r.validationStatus,
    createdBy: r.createdBy,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  })));
});

router.post("/rules", async (req, res): Promise<void> => {
  const { name, description, ruleType, criteria, roleId, createdBy } = req.body;
  if (!name || !description || !ruleType || !criteria || !createdBy) {
    res.status(400).json({ error: "name, description, ruleType, criteria, createdBy are required" });
    return;
  }
  const [rule] = await db.insert(filterRulesTable).values({
    name, description, ruleType, criteria,
    roleId: roleId ?? null,
    createdBy,
    status: "pending_validation",
    version: 1,
    validationStatus: "not_run",
  }).returning();

  await db.insert(ruleHistoryTable).values({
    ruleId: rule.id,
    version: 1,
    changedBy: createdBy,
    changes: "Rule created",
  });

  res.status(201).json({
    id: rule.id,
    name: rule.name,
    description: rule.description,
    ruleType: rule.ruleType,
    criteria: rule.criteria,
    status: rule.status,
    version: rule.version,
    roleId: rule.roleId,
    roleName: null,
    lastValidatedAt: null,
    validationStatus: rule.validationStatus,
    createdBy: rule.createdBy,
    createdAt: rule.createdAt.toISOString(),
    updatedAt: rule.updatedAt.toISOString(),
  });
});

router.get("/rules/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [rule] = await db.select().from(filterRulesTable).where(eq(filterRulesTable.id, id));
  if (!rule) { res.status(404).json({ error: "Not found" }); return; }

  const history = await db.select().from(ruleHistoryTable)
    .where(eq(ruleHistoryTable.ruleId, id))
    .orderBy(ruleHistoryTable.version);

  const validationRuns = await db.select().from(validationRunsTable)
    .where(eq(validationRunsTable.ruleId, id))
    .orderBy(validationRunsTable.startedAt);

  let roleName: string | null = null;
  if (rule.roleId) {
    const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, rule.roleId));
    roleName = role?.name ?? null;
  }

  res.json({
    rule: {
      id: rule.id,
      name: rule.name,
      description: rule.description,
      ruleType: rule.ruleType,
      criteria: rule.criteria,
      status: rule.status,
      version: rule.version,
      roleId: rule.roleId,
      roleName,
      lastValidatedAt: rule.lastValidatedAt?.toISOString() ?? null,
      validationStatus: rule.validationStatus,
      createdBy: rule.createdBy,
      createdAt: rule.createdAt.toISOString(),
      updatedAt: rule.updatedAt.toISOString(),
    },
    history: history.map((h) => ({
      id: h.id,
      version: h.version,
      changedAt: h.changedAt.toISOString(),
      changedBy: h.changedBy,
      changes: h.changes,
    })),
    validationRuns: validationRuns.map((v) => ({
      id: v.id,
      ruleId: v.ruleId,
      ruleName: rule.name,
      status: v.status,
      benchmarkCount: v.benchmarkCount,
      passCount: v.passCount,
      failCount: v.failCount,
      overrideJustification: v.overrideJustification,
      overriddenBy: v.overriddenBy,
      startedAt: v.startedAt.toISOString(),
      completedAt: v.completedAt?.toISOString() ?? null,
    })),
  });
});

router.patch("/rules/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [existing] = await db.select().from(filterRulesTable).where(eq(filterRulesTable.id, id));
  if (!existing) { res.status(404).json({ error: "Not found" }); return; }

  const { name, description, criteria, status } = req.body;
  const newVersion = existing.version + 1;

  const changes: string[] = [];
  if (name && name !== existing.name) changes.push(`Name changed from "${existing.name}" to "${name}"`);
  if (description && description !== existing.description) changes.push("Description updated");
  if (criteria && criteria !== existing.criteria) changes.push("Filter criteria updated");
  if (status && status !== existing.status) changes.push(`Status changed to ${status}`);

  const [updated] = await db.update(filterRulesTable)
    .set({
      name: name ?? existing.name,
      description: description ?? existing.description,
      criteria: criteria ?? existing.criteria,
      status: status ?? existing.status,
      version: newVersion,
      validationStatus: criteria ? "not_run" : existing.validationStatus,
    })
    .where(eq(filterRulesTable.id, id))
    .returning();

  if (changes.length > 0) {
    await db.insert(ruleHistoryTable).values({
      ruleId: id,
      version: newVersion,
      changedBy: "system",
      changes: changes.join("; "),
    });
  }

  res.json({
    id: updated.id,
    name: updated.name,
    description: updated.description,
    ruleType: updated.ruleType,
    criteria: updated.criteria,
    status: updated.status,
    version: updated.version,
    roleId: updated.roleId,
    roleName: null,
    lastValidatedAt: updated.lastValidatedAt?.toISOString() ?? null,
    validationStatus: updated.validationStatus,
    createdBy: updated.createdBy,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
});

router.delete("/rules/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  await db.update(filterRulesTable).set({ status: "archived" }).where(eq(filterRulesTable.id, id));
  res.json({ success: true });
});

router.post("/rules/:id/validate", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const ruleId = parseInt(raw, 10);

  const [rule] = await db.select().from(filterRulesTable).where(eq(filterRulesTable.id, ruleId));
  if (!rule) { res.status(404).json({ error: "Not found" }); return; }

  const benchmarks = await db.select().from(benchmarkResumesTable);

  // Simulate validation: randomly pass/fail based on benchmark type for demo
  let passCount = 0;
  let failCount = 0;
  const results: Array<{ benchmarkResumeId: number; candidateName: string; expectedOutcome: string; actualOutcome: string; passed: boolean; failReason?: string }> = [];

  for (const bm of benchmarks) {
    // Simple simulation: should-pass resumes pass unless rule is employment_gap or degree_requirement
    let actualOutcome = bm.expectedOutcome;
    let failReason: string | undefined;

    if (bm.expectedOutcome === "pass" && (rule.ruleType === "employment_gap" || rule.ruleType === "keyword_match")) {
      // Small chance of catching a false rejection
      const isFalseRejection = bm.scenario === "employment_gap" && rule.ruleType === "employment_gap";
      if (isFalseRejection) {
        actualOutcome = "fail";
        failReason = `Candidate incorrectly rejected by ${rule.name}: employment gap detected`;
      }
    }

    const passed = actualOutcome === bm.expectedOutcome;
    if (passed) passCount++; else failCount++;
    results.push({
      benchmarkResumeId: bm.id,
      candidateName: bm.candidateName,
      expectedOutcome: bm.expectedOutcome,
      actualOutcome,
      passed,
      failReason,
    });
  }

  const overallStatus = failCount > 0 ? "failed" : "passed";

  const [run] = await db.insert(validationRunsTable).values({
    ruleId,
    status: overallStatus,
    benchmarkCount: benchmarks.length,
    passCount,
    failCount,
    startedAt: new Date(),
    completedAt: new Date(),
  }).returning();

  if (results.length > 0) {
    await db.insert(validationResultsTable).values(results.map((r) => ({
      validationRunId: run.id,
      benchmarkResumeId: r.benchmarkResumeId,
      candidateName: r.candidateName,
      expectedOutcome: r.expectedOutcome,
      actualOutcome: r.actualOutcome,
      passed: r.passed,
      failReason: r.failReason ?? null,
    })));
  }

  await db.update(filterRulesTable).set({
    lastValidatedAt: new Date(),
    validationStatus: overallStatus,
    status: overallStatus === "passed" ? "active" : "pending_validation",
  }).where(eq(filterRulesTable.id, ruleId));

  res.status(201).json({
    id: run.id,
    ruleId: run.ruleId,
    ruleName: rule.name,
    status: run.status,
    benchmarkCount: run.benchmarkCount,
    passCount: run.passCount,
    failCount: run.failCount,
    overrideJustification: run.overrideJustification,
    overriddenBy: run.overriddenBy,
    startedAt: run.startedAt.toISOString(),
    completedAt: run.completedAt?.toISOString() ?? null,
  });
});

export default router;
