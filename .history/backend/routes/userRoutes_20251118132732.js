import express from "express";
import { sendOtp, registerUser, loginUser } from "../controllers/userAuthController.js";

const router = express.Router();

// OTP
router.post("/send-otp", sendOtp);

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

export default router;
