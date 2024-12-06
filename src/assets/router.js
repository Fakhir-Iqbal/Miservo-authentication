import { Router } from "express";
import { verifyAdminToken, verifyToken } from "../middleware/index.js";
import saveAsset from "../assets/addAsset.js";

const router = Router();

router.post('/add', verifyToken, saveAsset)

export default router;
