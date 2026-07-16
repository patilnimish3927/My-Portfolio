import { Router, type IRouter } from "express";
import healthRouter from "./health";
import portfolioRouter from "./portfolio";
import adminRouter from "./admin";
import visitorsRouter from "./visitors";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/portfolio", portfolioRouter);
router.use("/admin", adminRouter);
router.use("/admin/upload", uploadRouter);
router.use("/visitors", visitorsRouter);

export default router;
