import express from "express";

import {
  sendMechanicResetOtp,
  verifyMechanicResetOtp,
  resetMechanicPassword,
} from "../controllers/mechanicForgotController.js";

import {
  otpLimiter,
  loginLimiter,
} from "../middleware/rateLimit.js";

const router = express.Router();

// Send OTP
router.post(
  "/send-otp",
  otpLimiter,
  sendMechanicResetOtp
);

// Verify OTP
router.post(
  "/verify-otp",
  otpLimiter,
  verifyMechanicResetOtp
);

// Reset password
router.post(
  "/reset-password",
  loginLimiter,
  resetMechanicPassword
);

export default router;