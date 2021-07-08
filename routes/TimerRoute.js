import express from "express";
import { createTimer } from "../controllers/TimerController.js";

const router = express.Router();

router.post("/timers", createTimer);

export default router;