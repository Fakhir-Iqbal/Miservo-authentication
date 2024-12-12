import { Router } from "express";
import { verifyToken } from "../middleware/index.js";
import { saveBeneficiary } from "./addBeneficiary.js";
import pullBeneficiaries from './pullBeneficiaries.js'
import editBeneficiary from './editBeneficiary.js'

const router = Router();

router.post('/add', verifyToken, saveBeneficiary)
router.get('/get', verifyToken, pullBeneficiaries)
router.patch('/edit/:id', verifyToken, editBeneficiary)

export default router;
