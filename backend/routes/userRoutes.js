import express from "express";

import {
  sendOtp,
  loginUser,
  refreshUserToken,
  logoutUser,
  getMe,
  updateMe,
} from "../controllers/userAuthController.js";

import {
  sendSignupOtp,
  verifySignupOtp,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
} from "../controllers/userOtpController.js";

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


// =====================================================
// AUTH
// =====================================================

// New email OTP signup flow
router.post(
  "/send-signup-otp",
  sendSignupOtp
);

router.post(
  "/verify-signup-otp",
  verifySignupOtp
);

// Login
router.post(
  "/login",
  loginUser
);

// Refresh
router.post(
  "/refresh",
  refreshUserToken
);

// Logout
router.post(
  "/logout",
  logoutUser
);


// =====================================================
// PASSWORD RESET
// =====================================================

router.post(
  "/forgot-password/send-otp",
  sendPasswordResetOtp
);

router.post(
  "/forgot-password/verify-otp",
  verifyPasswordResetOtp
);

router.post(
  "/forgot-password/reset",
  resetPassword
);


// =====================================================
// OLD PHONE OTP
// =====================================================

// Keep temporarily so other existing code does not break.
// New UserSignup should NOT use this route.

router.post(
  "/send-otp",
  sendOtp
);


// =====================================================
// LEGACY REGISTER
// =====================================================

// Existing endpoint kept so project routing doesn't suddenly
// break. New signup MUST use email OTP endpoints above.

// router.post(
//   "/register",
//   registerUser
// );


// =====================================================
// USER PROFILE
// =====================================================

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


// =====================================================
// REQUESTS
// =====================================================

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


// =====================================================
// NOTIFICATIONS
// =====================================================

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