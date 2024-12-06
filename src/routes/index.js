import { Router } from "express";
import authRoutes from "./../auth/routes.js";
import beneficiary from './../beneficiaries/router.js'
import asset from './../assets/router.js'

const router = Router();

router.use("/user", authRoutes);
router.use("/beneficiary", beneficiary);
router.use('/asset', asset)

export default router;
