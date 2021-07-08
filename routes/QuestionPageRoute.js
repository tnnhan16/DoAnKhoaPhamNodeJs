import express from "express";
import {getSingleQuestion} from "../controllers/QuestionPageController.js";

const router = express.Router();

router.post("/question/getSingleQuestion", getSingleQuestion);

export default router;