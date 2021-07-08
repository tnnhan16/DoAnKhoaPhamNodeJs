import express from "express";
import { createQuestion, updateQuestion, deleteQuestion } from "../controllers/QuestionController.js";

const router = express.Router();

router.post("/questions", createQuestion);
router.post("/questions/update", updateQuestion);
router.post("/questions/delete", deleteQuestion);

export default router;