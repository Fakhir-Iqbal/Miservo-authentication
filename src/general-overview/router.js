import { Router } from "express";
import { verifyToken } from "../middleware/index.js";
import { saveGeneralOverview } from "./addGeneralOverview.js";
import pullGeneralOverview from "./pullGeneralOverview.js";

const router = Router();

router.post('/add', verifyToken, saveGeneralOverview)
router.get('/get', verifyToken, pullGeneralOverview)

export default router;
