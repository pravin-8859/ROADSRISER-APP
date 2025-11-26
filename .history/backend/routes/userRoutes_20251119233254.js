import express from "express";
import {
  sendOtp,
  registerUser,
  loginUser,
} from "../controllers/userAuthController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);


router.post("/requests", protect, createRequest);
router.get("/requests/active", protect, getActiveRequest);
router.get("/requests/history", protect, getHistory);

router.get("/notifications", protect, getUserNotifications);
router.post("/notifications/:id/read", protect, markRead);

export default router;
