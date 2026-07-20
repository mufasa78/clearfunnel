import { Router, type IRouter } from "express";
import { db, rolesTable, filterRulesTable, decisionsTable } from "@workspace/db";
import { eq, count, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/roles", async (req, res): Promise<void> => {
  const roles = await db.select().from(rolesTable).orderBy(rolesTable.name);

  const rulesCount = await db
    .select({ roleId: filterRulesTable.roleId, cnt: count() })
    .from(filterRulesTable)
    .where(eq(filterRulesTable.status, "active"))
    .groupBy(filterRulesTable.roleId);

  const decisionsCount = await db
    .select({ roleId: decisionsTable.roleId, cnt: count() })
    .from(decisionsTable)
    .groupBy(decisionsTable.roleId);

  const rulesMap = new Map(rulesCount.map((r) => [r.roleId, Number(r.cnt)]));
  const decisionsMap = new Map(decisionsCount.map((d) => [d.roleId, Number(d.cnt)]));

  const result = roles.map((r) => ({
    id: r.id,
    name: r.name,
    department: r.department,
    activeRuleCount: rulesMap.get(r.id) ?? 0,
    totalRejections: decisionsMap.get(r.id) ?? 0,
    createdAt: r.createdAt.toISOString(),
  }));

  res.json(result);
});

router.post("/roles", async (req, res): Promise<void> => {
  const { name, department } = req.body;
  if (!name) {
    res.status(400).json({ error: "name is required" });
    return;
  }
  const [role] = await db.insert(rolesTable).values({ name, department }).returning();
  res.status(201).json({
    id: role.id,
    name: role.name,
    department: role.department,
    activeRuleCount: 0,
    totalRejections: 0,
    createdAt: role.createdAt.toISOString(),
  });
});

router.get("/roles/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [role] = await db.select().from(rolesTable).where(eq(rolesTable.id, id));
  if (!role) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({
    id: role.id,
    name: role.name,
    department: role.department,
    activeRuleCount: 0,
    totalRejections: 0,
    createdAt: role.createdAt.toISOString(),
  });
});

export default router;
