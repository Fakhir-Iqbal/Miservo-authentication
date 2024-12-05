import { Router } from "express";
import { verifyAdminToken, verifyToken } from "../middleware/index.js";
import { saveBeneficiary } from "./addBeneficiary.js";

const router = Router();

router.post('/add', verifyToken, saveBeneficiary)

export default router;
