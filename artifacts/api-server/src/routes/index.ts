import { Router, type IRouter } from "express";
import healthRouter from "./health";
import rolesRouter from "./roles";
import rulesRouter from "./rules";
import validationRouter from "./validation";
import benchmarksRouter from "./benchmarks";
import decisionsRouter from "./decisions";
import candidatesRouter from "./candidates";
import alertsRouter from "./alerts";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(rolesRouter);
router.use(rulesRouter);
router.use(validationRouter);
router.use(benchmarksRouter);
router.use(decisionsRouter);
router.use(candidatesRouter);
router.use(alertsRouter);
router.use(dashboardRouter);

export default router;
