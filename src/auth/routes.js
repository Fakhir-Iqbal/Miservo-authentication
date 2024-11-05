import { Router } from "express";
import { verifyAdminToken, verifyToken } from "../middleware/index.js";

// admin's import
import signUpAdmin from "./admin/signUpAdmin.js";
import loginAdmin from "./admin/loginAdmin.js";
// user's import
import createUser from "./user/createUser.js";
import loginUser from "./user/loginUser.js";
import modifyUser from "./user/modifyUser.js";
import deleteUser from "./user/deleteUser.js";
import forgetUser from './user/forgetPassword.js'
import resetPassword from "./user/resetPassword.js";

const router = Router();

// ============== admin routes ============== //

router.post("/signup", signUpAdmin); // POST 
router.post("/signin", loginAdmin); // POST

// ============== user routes ============== //

router.post("/create", createUser); // POST
router.post("/login", loginUser); // POST
router.post("/forget", forgetUser); // POST
router.post("/reset-password/:token", resetPassword); // POST
router.patch("/edit-user/:id", verifyToken, modifyUser); // PATCH
router.delete("/delete-user", deleteUser); // DELETE


export default router;
