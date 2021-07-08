import express from "express";
import { createSetq, getAllSetq, getSingleSetq, updateSetq, deleteSetq } from "../controllers/SetqController.js";

const router = express.Router();

router.get("/setqs", getAllSetq);
router.post("/setqs", createSetq);
router.get("/setqs/:_id", getSingleSetq);
router.patch("/setqs/:_id", updateSetq);
router.delete("/setqs/:_id", deleteSetq);


export default router;