// routes/otpRoutes.js
import express from "express";
import { sendOtp } from "../controllers/mechanicController.js";
const router = express.Router();

// POST /api/otp/send  (frontend calls /api/otp/send)
router.post("/send", sendOtp);

export default router;
