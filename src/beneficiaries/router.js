import { Router } from "express";
import { verifyAdminToken, verifyToken } from "../middleware/index.js";
import { saveBeneficiary } from "./addBeneficiary.js";
import pullBeneficiaries from './pullBeneficiaries.js'

const router = Router();

router.post('/add', verifyToken, saveBeneficiary)
router.get('/get', verifyToken, pullBeneficiaries)

export default router;
