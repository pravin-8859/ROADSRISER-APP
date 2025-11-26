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
router.post("/logout", logout);

router.post("/signup", mechanicSignup);
router.post("/login", mechanicLogin);

export default router;
