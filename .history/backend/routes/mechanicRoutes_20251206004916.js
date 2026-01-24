import express from "express";
import { sendOtp, mechanicSignup, mechanicLogin } from "../controllers/mechanicController.js";
import { otpLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

// APPLY OTP LIMITER HERE 👇👇👇
router.post("/send-otp", otpLimiter, sendOtp);

// SIGNUP
router.post("/signup", mechanicSignup);

// LOGIN
router.post("/login", mechanicLogin);

export default router;
