import express from "express";
import { userLogin, verifyToken, userLogout } from "../controllers/LoginController.js";

const router = express.Router();

router.post("/login", userLogin);
router.post("/verifyToken", verifyToken);
router.post("/logout", userLogout);

export default router;