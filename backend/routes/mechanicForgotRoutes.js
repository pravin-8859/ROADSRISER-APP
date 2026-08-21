import express from "express";

import {
  sendMechanicResetOtp,
  verifyMechanicResetOtp,
  resetMechanicPassword,
} from "../controllers/mechanicForgotController.js";

const router = express.Router();


// Send OTP
router.post(
  "/send-otp",
  sendMechanicResetOtp
);


// Verify OTP
router.post(
  "/verify-otp",
  verifyMechanicResetOtp
);


// Reset password
router.post(
  "/reset-password",
  resetMechanicPassword
);


export default router;