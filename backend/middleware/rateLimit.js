// middleware/rateLimit.js
import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6, // limit to 6 OTP requests per IP per window
  message: { message: "Too many OTP requests, try later" },
  standardHeaders: true,
  legacyHeaders: false,
});
