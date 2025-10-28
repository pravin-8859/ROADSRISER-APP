import express from "express";
import { mechanicSignup, mechanicLogin } from "../controllers/mechanicController.js";
const router = express.Router();

router.post("/signup", mechanicSignup);
router.post("/login", mechanicLogin);

export default router;
