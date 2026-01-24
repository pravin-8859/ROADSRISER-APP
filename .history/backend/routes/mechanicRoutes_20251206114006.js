import express from "express";
import {
  sendOtp,
  mechanicSignup,
  mechanicLogin,
  logout
} from "../controllers/mechanicController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/register", mechanicSignup);
router.post("/login", mechanicLogin);
router.post("/logout", logout);

export default router;
