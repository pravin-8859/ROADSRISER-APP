import express from "express";

import {
  sendOtp,
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
  getMe,
  updateMe,
} from "../controllers/userAuthController.js";

import {
  createRequest,
  getActiveRequest,
  getHistory,
} from "../controllers/requestController.js";

import {
  getUserNotifications,
  markRead,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// ================= AUTH =================

router.post("/send-otp", sendOtp);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/refresh", refreshUserToken);

router.post("/logout", logoutUser);

// ================= USER PROFILE =================

router.get(
  "/me",
  protect,
  getMe
);

router.put(
  "/me",
  protect,
  updateMe
);

// ================= REQUESTS =================

router.post(
  "/requests",
  protect,
  createRequest
);

router.get(
  "/requests/active",
  protect,
  getActiveRequest
);

router.get(
  "/requests/history",
  protect,
  getHistory
);

// ================= NOTIFICATIONS =================

router.get(
  "/notifications",
  protect,
  getUserNotifications
);

router.post(
  "/notifications/:id/read",
  protect,
  markRead
);

export default router;