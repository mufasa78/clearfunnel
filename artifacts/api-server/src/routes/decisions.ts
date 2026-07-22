import { Router, type Request, type Response } from "express";
import { db, decisionsTable, decisionRulesTable, candidatesTable, rolesTable, filterRulesTable } from "@workspace/db";
import { eq, and, sql, inArray } from "drizzle-orm";

const router = Router();

async function enrichDecision(d: typeof decisionsTable.$inferSelect) {
  const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.id, d.candidateId));
  const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, d.roleId));
  const rules = await db.select().from(decisionRulesTable).where(eq(decisionRulesTable.decisionId, d.id));

  return {
    id: d.id,
    candidateId: d.candidateId,
    candidateName: candidate?.name ?? "Unknown",
    roleId: d.roleId,
    roleName: role?.name ?? "Unknown",
    triggeredRules: rules.map((r) => ({
      ruleId: r.ruleId,
      ruleName: r.ruleName,
      ruleDescription: r.ruleDescription,
    })),
    rejectionSummary: d.rejectionSummary,
    rejectedAt: d.rejectedAt.toISOString(),
    recoverable: d.recoverable,
    recovered: d.recovered,
    recoveredAt: d.recoveredAt?.toISOString() ?? null,
    recoveredBy: d.recoveredBy,
  };
}

router.get("/decisions", async (req: Request, res: Response): Promise<void> => {
  const { roleId, ruleId, recovered, limit = "50", offset = "0" } = req.query;

  let allDecisions = await db.select().from(decisionsTable).orderBy(decisionsTable.rejectedAt);

  if (roleId) {
    allDecisions = allDecisions.filter((d) => d.roleId === parseInt(roleId as string, 10));
  }
  if (typeof recovered !== "undefined") {
    const isRecovered = recovered === "true";
    allDecisions = allDecisions.filter((d) => d.recovered === isRecovered);
  }

  const total = allDecisions.length;
  const lim = parseInt(limit as string, 10);
  const off = parseInt(offset as string, 10);
  const paged = allDecisions.slice(off, off + lim);

  if (ruleId) {
    const ruleIdNum = parseInt(ruleId as string, 10);
    const ruleDecisionIds = await db
      .select({ decisionId: decisionRulesTable.decisionId })
      .from(decisionRulesTable)
      .where(eq(decisionRulesTable.ruleId, ruleIdNum));
    const ruleDecisionIdSet = new Set(ruleDecisionIds.map((r) => r.decisionId));
    const filtered = paged.filter((d) => ruleDecisionIdSet.has(d.id));
    const items = await Promise.all(filtered.map(enrichDecision));
    res.json({ items, total: filtered.length });
    return;
  }

  const items = await Promise.all(paged.map(enrichDecision));
  res.json({ items, total });
});

router.post("/decisions", async (req: Request, res: Response): Promise<void> => {
  const { candidateId, roleId, triggeredRuleIds } = req.body;
  if (!candidateId || !roleId || !triggeredRuleIds) {
    res.status(400).json({ error: "candidateId, roleId, triggeredRuleIds are required" });
    return;
  }

  const rules = triggeredRuleIds.length > 0
    ? await db.select().from(filterRulesTable).where(inArray(filterRulesTable.id, triggeredRuleIds))
    : [];

  const summary = rules.length > 0
    ? `Rejected due to: ${rules.map((r) => r.description).join("; ")}`
    : "Rejected by automated filter";

  const [decision] = await db.insert(decisionsTable).values({
    candidateId,
    roleId,
    rejectionSummary: summary,
    recoverable: true,
    recovered: false,
  }).returning();

  if (rules.length > 0) {
    await db.insert(decisionRulesTable).values(rules.map((r) => ({
      decisionId: decision.id,
      ruleId: r.id,
      ruleName: r.name,
      ruleDescription: r.description,
    })));
  }

  res.status(201).json(await enrichDecision(decision));
});

router.get("/decisions/:id", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [decision] = await db.select().from(decisionsTable).where(eq(decisionsTable.id, id));
  if (!decision) { res.status(404).json({ error: "Not found" }); return; }
  res.json(await enrichDecision(decision));
});

export default router;
