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

// APPLY OTP LIMITER HERE 👇👇👇
router.post("/send-otp", otpLimiter, sendOtp);

router.post("/signup", mechanicSignup);
router.post("/login", mechanicLogin);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);


export default router;
