import { Router } from "express";
import authRoutes from "./../auth/routes.js";
import beneficiary from './../beneficiaries/router.js';
import asset from './../assets/router.js';
import attorney from './../attorney/router.js';
import generalOverview from './../general-overview/router.js';
import emergencyContact from './../emergency-contact/router.js';

const router = Router();

router.use("/user", authRoutes);
router.use("/beneficiary", beneficiary);
router.use('/asset', asset)
router.use('/attorney', attorney)
router.use('/overview', generalOverview)
router.use('/emergency', emergencyContact)

export default router;
