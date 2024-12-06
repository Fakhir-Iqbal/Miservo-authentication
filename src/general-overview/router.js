import { Router } from "express";
import { verifyToken } from "../middleware/index.js";
import { saveGeneralOverview } from "./addGeneralOverview.js";

const router = Router();

router.post('/add', verifyToken, saveGeneralOverview)


export default router;
