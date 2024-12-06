import { Router } from "express";
import { verifyToken } from "../middleware/index.js";
import saveEmergencyContact from "./emergencyContact.js";

const router = Router();

router.post('/contact', verifyToken, saveEmergencyContact)


export default router;
