import { Router } from "express";
import { verifyAdminToken, verifyToken } from "../middleware/index.js";
import saveAsset from "./addAsset.js";
import pullAsset from './pullAsset.js'
const router = Router();

router.post('/add', verifyToken, saveAsset)
router.get('/get', verifyToken, pullAsset)

export default router;
