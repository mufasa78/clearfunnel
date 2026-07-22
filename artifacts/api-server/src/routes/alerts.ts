import { Router, type Request, type Response } from "express";
import { db, alertsTable, rolesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/alerts", async (req: Request, res: Response): Promise<void> => {
  const { status, roleId } = req.query;

  let conditions: any[] = [];
  if (status) conditions.push(eq(alertsTable.status, status as string));
  if (roleId) conditions.push(eq(alertsTable.roleId, parseInt(roleId as string, 10)));

  const alerts = conditions.length > 0
    ? await db.select().from(alertsTable).where(and(...conditions)).orderBy(alertsTable.detectedAt)
    : await db.select().from(alertsTable).orderBy(alertsTable.detectedAt);

  const roleIds = [...new Set(alerts.map((a) => a.roleId))];
  const roles = roleIds.length > 0
    ? await db.select().from(rolesTable)
    : [];
  const roleMap = new Map(roles.map((r) => [r.id, r.name]));

  res.json(alerts.map((a) => ({
    id: a.id,
    roleId: a.roleId,
    roleName: roleMap.get(a.roleId) ?? "Unknown",
    alertType: a.alertType,
    severity: a.severity,
    message: a.message,
    correlatedRuleId: a.correlatedRuleId,
    correlatedRuleName: a.correlatedRuleName,
    status: a.status,
    detectedAt: a.detectedAt.toISOString(),
    resolvedAt: a.resolvedAt?.toISOString() ?? null,
    resolvedBy: a.resolvedBy,
  })));
});

router.patch("/alerts/:id", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [existing] = await db.select().from(alertsTable).where(eq(alertsTable.id, id));
  if (!existing) { res.status(404).json({ error: "Not found" }); return; }

  const { status, resolvedBy } = req.body;
  const [updated] = await db.update(alertsTable).set({
    status: status ?? existing.status,
    resolvedBy: resolvedBy ?? existing.resolvedBy,
    resolvedAt: status === "resolved" ? new Date() : existing.resolvedAt,
  }).where(eq(alertsTable.id, id)).returning();

  const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, updated.roleId));

  res.json({
    id: updated.id,
    roleId: updated.roleId,
    roleName: role?.name ?? "Unknown",
    alertType: updated.alertType,
    severity: updated.severity,
    message: updated.message,
    correlatedRuleId: updated.correlatedRuleId,
    correlatedRuleName: updated.correlatedRuleName,
    status: updated.status,
    detectedAt: updated.detectedAt.toISOString(),
    resolvedAt: updated.resolvedAt?.toISOString() ?? null,
    resolvedBy: updated.resolvedBy,
  });
});

export default router;
