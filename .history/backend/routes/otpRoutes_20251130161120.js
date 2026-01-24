import express from "express";
import { sendEmailOtp } from "../controllers/otpController.js";

const router = express.Router();

router.post("/send-email-otp", sendEmailOtp);

export default router;
