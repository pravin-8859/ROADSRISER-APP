import express from "express";
import {
  sendOtp,
  mechanicSignup,
  mechanicLogin,
  refreshAccessToken,
  logout,
} from "../controllers/mechanicController.js";

import { otpLimiter } from "../middleware/rateLimit.js";

const router = express.Router();

// OTP Route With Rate Limiter
router.post("/send-otp", otpLimiter, sendOtp);

// Signup
router.post("/signup", mechanicSignup);

// Login
router.post("/login", mechanicLogin);

// Refresh Token
router.post("/refresh-token", refreshAccessToken);

// Logout
router.post("/logout", logout);

export default router;
