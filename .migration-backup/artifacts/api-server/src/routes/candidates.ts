import { Router, type Request, type Response } from "express";
import { db, candidatesTable, decisionsTable, decisionRulesTable, rolesTable } from "@workspace/db";
import { eq, and, ilike, or } from "drizzle-orm";

const router = Router();

async function enrichCandidate(c: typeof candidatesTable.$inferSelect) {
  const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, c.roleId));
  const [latestDecision] = await db.select().from(decisionsTable)
    .where(eq(decisionsTable.candidateId, c.id))
    .orderBy(decisionsTable.rejectedAt);

  return {
    id: c.id,
    name: c.name,
    email: c.email,
    roleId: c.roleId,
    roleName: role?.name ?? "Unknown",
    rejectionSummary: latestDecision?.rejectionSummary ?? "Auto-rejected by ATS filter",
    rejectedAt: c.rejectedAt.toISOString(),
    recovered: c.recovered,
    recoveredAt: c.recoveredAt?.toISOString() ?? null,
    recoveredBy: c.recoveredBy,
    recoveryReason: c.recoveryReason,
    retentionExpiresAt: c.retentionExpiresAt.toISOString(),
  };
}

router.get("/candidates", async (req: Request, res: Response): Promise<void> => {
  const { roleId, recovered, search } = req.query;

  let candidates = await db.select().from(candidatesTable).orderBy(candidatesTable.rejectedAt);

  if (roleId) {
    candidates = candidates.filter((c) => c.roleId === parseInt(roleId as string, 10));
  }
  if (typeof recovered !== "undefined") {
    const isRecovered = recovered === "true";
    candidates = candidates.filter((c) => c.recovered === isRecovered);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    candidates = candidates.filter((c) =>
      c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
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
      id: d.id,
      candidateId: d.candidateId,
      candidateName: candidate.name,
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
  }));

  res.json({
    candidate: await enrichCandidate(candidate),
    decisions: enrichedDecisions,
  });
});

router.post("/candidates/:id/recover", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [candidate] = await db.select().from(candidatesTable).where(eq(candidatesTable.id, id));
  if (!candidate) { res.status(404).json({ error: "Not found" }); return; }

  const { recoveredBy, reason } = req.body;
  if (!recoveredBy || !reason) {
    res.status(400).json({ error: "recoveredBy and reason are required" });
    return;
  }

  const [updated] = await db.update(candidatesTable).set({
    recovered: true,
    recoveredAt: new Date(),
    recoveredBy,
    recoveryReason: reason,
  }).where(eq(candidatesTable.id, id)).returning();

  // Also update related decisions
  await db.update(decisionsTable).set({
    recovered: true,
    recoveredAt: new Date(),
    recoveredBy,
  }).where(eq(decisionsTable.candidateId, id));

  res.json(await enrichCandidate(updated));
});

export default router;
