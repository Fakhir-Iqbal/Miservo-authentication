import { Router } from "express";
import { verifyToken } from "../middleware/index.js";
import saveEmergencyContact from "./emergencyContact.js";
import pullEContacts from './pullEContacts.js'

const router = Router();

router.post('/add', verifyToken, saveEmergencyContact)
router.get('/get', verifyToken, pullEContacts)

export default router;
