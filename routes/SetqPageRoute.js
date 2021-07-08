import express from "express";
import { setqPage, setqCreatePage, setqUpdatePage, getSingleSetq } from "../controllers/SetqPageController.js";

const router = express.Router();

router.get("/setq", setqPage);
router.post("/setq/getSingleSetq", getSingleSetq);
router.get("/setq/create/", setqCreatePage);
router.get("/setq/update/:_id", setqUpdatePage);

export default router;