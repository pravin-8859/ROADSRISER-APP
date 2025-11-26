import express from "express";
import {
  sendOtp,
  mechanicSignup,
  mechanicLogin,
  refreshAccessToken,
  logout,
  resetPassword
} from "../controllers/mechanicController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/register", mechanicSignup);
router.post("/login", mechanicLogin);
router.get("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.post("/reset-password", resetPassword);

export default router;
