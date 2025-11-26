import express from "express";
import {
  sendOtp,
  mechanicSignup,
  mechanicLogin,
  refreshAccessToken,
  logout,
  resetPassword,
} from "../controllers/mechanicController.js";

const router = express.Router();

// OTP
router.post("/send-otp", sendOtp);

// Signup
router.post("/register", mechanicSignup);

// Login
router.post("/login", mechanicLogin);

// Refresh Token
router.get("/refresh", refreshAccessToken);

// Logout
router.post("/logout", logout);

// Reset Password
router.post("/reset-password", resetPassword);

export default router;
