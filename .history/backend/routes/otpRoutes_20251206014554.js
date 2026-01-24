// backend/routes/otpRoutes.js
import express from "express";
import { sendOtp } from "../controllers/mechanicController.js";

const router = express.Router();

// Send OTP (email + phone both supported)
router.post("/send", sendOtp);

export default router;
