import express from "express";
import {userRegisterPage, userLoginPage, userLogoutPage } from "../controllers/LoginPageController.js";

const router = express.Router();

router.get("/", userLoginPage);

router.get("/login", userLoginPage);

router.get("/register", userRegisterPage);

router.get("/logoutPage", userLogoutPage);

export default router;