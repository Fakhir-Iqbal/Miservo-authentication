import { Router } from "express";
import { verifyAdminToken, verifyToken } from "../middleware/index.js";
import saveAttorney from "./addAttorney.js";
import pullAttorney from "./pullAttorney.js";

const router = Router();

router.post('/add', verifyToken, saveAttorney)
router.get('/get', verifyToken, pullAttorney)

export default router;
