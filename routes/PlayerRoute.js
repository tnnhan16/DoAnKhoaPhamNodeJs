import express from "express";
import { playerJoin } from "../controllers/PlayerController.js";

const router = express.Router();

router.get("/join", function(req, res){
    res.render("testJoin");
});
router.post("/join", playerJoin);

export default router;