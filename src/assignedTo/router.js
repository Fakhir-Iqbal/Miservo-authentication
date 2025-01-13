import { Router } from "express";
import getAssignedTo from "./getAssignedTo.js";


const router = Router();

router.get("/", getAssignedTo)

export default router;
