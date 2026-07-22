import { Router, type Request, type Response } from "express";
import { db, benchmarkResumesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/benchmark-resumes", async (req: Request, res: Response): Promise<void> => {
  const resumes = await db.select().from(benchmarkResumesTable).orderBy(benchmarkResumesTable.createdAt);
  res.json(resumes.map((r) => ({
    id: r.id,
    candidateName: r.candidateName,
    scenario: r.scenario,
    expectedOutcome: r.expectedOutcome,
    background: r.background,
    tags: r.tags,
    createdAt: r.createdAt.toISOString(),
  })));
});

router.post("/benchmark-resumes", async (req: Request, res: Response): Promise<void> => {
  const { candidateName, scenario, expectedOutcome, background, tags } = req.body;
  if (!candidateName || !scenario || !expectedOutcome || !background) {
    res.status(400).json({ error: "candidateName, scenario, expectedOutcome, background are required" });
    return;
  }
  const [resume] = await db.insert(benchmarkResumesTable).values({
    candidateName,
    scenario,
    expectedOutcome,
    background,
    tags: tags ?? [],
  }).returning();
  res.status(201).json({
    id: resume.id,
    candidateName: resume.candidateName,
    scenario: resume.scenario,
    expectedOutcome: resume.expectedOutcome,
    background: resume.background,
    tags: resume.tags,
    createdAt: resume.createdAt.toISOString(),
  });
});

router.delete("/benchmark-resumes/:id", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  await db.delete(benchmarkResumesTable).where(eq(benchmarkResumesTable.id, id));
  res.json({ success: true });
});

export default router;
