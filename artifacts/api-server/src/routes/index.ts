import { Router } from "express";
import authRouter from "./auth.js";
import healthRouter from "./health.js";
import rolesRouter from "./roles.js";
import rulesRouter from "./rules.js";
import validationRouter from "./validation.js";
import benchmarksRouter from "./benchmarks.js";
import decisionsRouter from "./decisions.js";
import candidatesRouter from "./candidates.js";
import alertsRouter from "./alerts.js";
import dashboardRouter from "./dashboard.js";
import governanceRouter from "./governance.js";

const router = Router();

router.use("/auth", authRouter);
router.use(healthRouter);
router.use(rolesRouter);
router.use(rulesRouter);
router.use(validationRouter);
router.use(benchmarksRouter);
router.use(decisionsRouter);
router.use(candidatesRouter);
router.use(alertsRouter);
router.use(dashboardRouter);
router.use(governanceRouter);

export default router;