import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import householdsRouter from "./households";
import membersRouter from "./members";
import roomsRouter from "./rooms";
import expensesRouter from "./expenses";
import choresRouter from "./chores";
import rulesRouter from "./rules";
import paymentsRouter from "./payments";
import dashboardRouter from "./dashboard";
import landlordRouter from "./landlord";
import notificationsRouter from "./notifications";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(householdsRouter);
router.use(membersRouter);
router.use(roomsRouter);
router.use(expensesRouter);
router.use(choresRouter);
router.use(rulesRouter);
router.use(paymentsRouter);
router.use(dashboardRouter);
router.use(landlordRouter);
router.use(notificationsRouter);

export default router;
