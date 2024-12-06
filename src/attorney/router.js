import { Router } from "express";
import { verifyAdminToken, verifyToken } from "../middleware/index.js";
import saveAttorney from "./addAttorney.js";

const router = Router();

router.post('/add', verifyToken, saveAttorney)

export default router;
