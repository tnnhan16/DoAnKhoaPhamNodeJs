import express from "express";
import { createUser, getAllUser, getSingleUser, updateUser, deleteUser } from "../controllers/UserController.js";

const router = express.Router();

router.get("/users", getAllUser);
router.post("/users", createUser);
router.get("/users/:_id", getSingleUser);
router.patch("/users/:_id", updateUser);
router.delete("/users/:_id", deleteUser);

export default router;