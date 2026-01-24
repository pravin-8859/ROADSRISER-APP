import express from "express";
import {
  sendOtp,
  mechanicSignup,
  mechanicLogin,
  logout,
  refreshAccessToken,
  resetPassword
} from "../controllers/mechanicController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/signup", mechanicSignup);
router.post("/login", mechanicLogin);
router.post("/logout", logout);
router.get("/refresh-token", refreshAccessToken);
router.post("/reset-password", resetPassword);

export default router;
