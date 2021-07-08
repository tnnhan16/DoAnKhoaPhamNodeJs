import express from "express";
import { playGame, showPoint, hostGame } from "../controllers/EventController.js";

const router = express.Router();

router.post("/play", playGame);
router.post("/point", showPoint);
router.patch("/host/:_id", hostGame);

export default router;