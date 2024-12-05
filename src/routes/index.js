import { Router } from "express";
import authRoutes from "./../auth/routes.js";
import beneficiary from './../apis/router.js'

const router = Router();

router.use("/user", authRoutes);
router.use("/beneficiary", beneficiary);

export default router;
