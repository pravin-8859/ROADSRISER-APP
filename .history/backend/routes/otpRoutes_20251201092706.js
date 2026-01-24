import express from "express";
import { sendOtp, mechanicSignup } from "./controllers/mechanicController.js";
import { otpLimiter } from "./middleware/rateLimit.js";

const router = express.Router();

router.post("/mechanics/send-otp", otpLimiter, sendOtp);
router.post("/mechanics/signup", mechanicSignup);
