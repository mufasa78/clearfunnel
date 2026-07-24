import { Router, type Request, type Response } from "express";
import { db, alertsTable, rolesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { zScoreSeverity } from "../lib/algorithms.js";

const router = Router();

router.get("/alerts", async (req: Request, res: Response): Promise<void> => {
  const { status } = req.query;

  const alerts = status
    ? await db.select().from(alertsTable).where(eq(alertsTable.status, status as string)).orderBy(sql`${alertsTable.detectedAt} DESC`)
    : await db.select().from(alertsTable).orderBy(sql`${alertsTable.detectedAt} DESC`);

  const roles = await db.select().from(rolesTable);
  const roleMap = new Map(roles.map((r) => [r.id, r.name]));

  // Aggregate stats
  const openAlerts = alerts.filter((a) => a.status === "open");
  const criticalCount = openAlerts.filter((a) => a.severity === "critical").length;
  const highCount = openAlerts.filter((a) => a.severity === "high").length;
  const avgZScore = openAlerts.filter((a) => a.zScore !== null).length > 0
    ? Math.round(openAlerts.filter((a) => a.zScore !== null)
        .reduce((s, a) => s + Math.abs(a.zScore!), 0) /
        openAlerts.filter((a) => a.zScore !== null).length * 10) / 10
    : null;

  const enriched = alerts.map((a) => ({
    id: a.id, roleId: a.roleId, roleName: roleMap.get(a.roleId) ?? "Unknown",
    alertType: a.alertType, severity: a.severity, message: a.message,
    correlatedRuleId: a.correlatedRuleId, correlatedRuleName: a.correlatedRuleName,
    status: a.status, detectedAt: a.detectedAt.toISOString(),
    resolvedAt: a.resolvedAt?.toISOString() ?? null, resolvedBy: a.resolvedBy,
    // Anomaly detection data
    zScore: a.zScore,
    baselineRate: a.baselineRate,
    currentRate: a.currentRate,
    recruiterId: a.recruiterId,
    affectedCandidates: a.affectedCandidates,
    anomalyLabel: a.zScore !== null ? `${Math.abs(a.zScore).toFixed(1)}σ ${a.zScore > 0 ? "above" : "below"} baseline` : null,
  }));

  res.json({
    alerts: enriched,
    summary: {
      totalOpen: openAlerts.length,
      criticalCount,
      highCount,
      avgZScore,
      totalAffectedCandidates: openAlerts.reduce((s, a) => s + (a.affectedCandidates ?? 0), 0),
    },
  });
});

router.patch("/alerts/:id", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [existing] = await db.select().from(alertsTable).where(eq(alertsTable.id, id));
  if (!existing) { res.status(404).json({ error: "Not found" }); return; }

  const { status, resolvedBy } = req.body;
  const [updated] = await db.update(alertsTable).set({
    status, resolvedBy,
    resolvedAt: status === "resolved" ? new Date() : null,
  }).where(eq(alertsTable.id, id)).returning();

  const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, updated.roleId));
  res.json({
    id: updated.id, roleId: updated.roleId, roleName: role?.name ?? "Unknown",
    alertType: updated.alertType, severity: updated.severity, message: updated.message,
    correlatedRuleId: updated.correlatedRuleId, correlatedRuleName: updated.correlatedRuleName,
    status: updated.status, detectedAt: updated.detectedAt.toISOString(),
    resolvedAt: updated.resolvedAt?.toISOString() ?? null, resolvedBy: updated.resolvedBy,
    zScore: updated.zScore, baselineRate: updated.baselineRate, currentRate: updated.currentRate,
    recruiterId: updated.recruiterId, affectedCandidates: updated.affectedCandidates,
    anomalyLabel: updated.zScore !== null
      ? `${Math.abs(updated.zScore).toFixed(1)}σ ${updated.zScore > 0 ? "above" : "below"} baseline`
      : null,
  });
});

export default router;
