import { Router, type IRouter } from "express";
import healthRouter from "./health";
import financeRouter from "./finance";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(requireAuth);
router.use(financeRouter);

export default router;
