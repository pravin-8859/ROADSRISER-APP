import express from "express";
import {
  otpLimiter,
  signupLimiter,
  loginLimiter,
} from "../middleware/rateLimit.js";

import {
  sendOtp,
  mechanicSignup,
  mechanicLogin,
  refreshMechanicToken,
  logout,
  getMechanicProfile,
  updateMechanicProfile,
  updateGarageLocation,
  updateCurrentLocation,
  updateMechanicAvailability,
} from "../controllers/mechanicController.js";

import {
  getMechanicRequests,
  getMechanicEarnings,
  acceptRequest,
  cancelMechanicRequest,
  updateRequestStatus,
} from "../controllers/requestController.js";

import { verifyMechanic } from "../middleware/authMiddleware.js";

const router = express.Router();

// OTP
router.post("/send-otp", otpLimiter, sendOtp);

// SIGNUP
router.post("/register", signupLimiter, mechanicSignup);

// LOGIN
router.post("/login", loginLimiter, mechanicLogin);

// AUTH
router.post("/refresh", refreshMechanicToken);
router.post("/logout", logout);

// PROFILE
router.get("/me", verifyMechanic, getMechanicProfile);
router.put("/me", verifyMechanic, updateMechanicProfile);

// LOCATION
router.put(
  "/location/garage",
  verifyMechanic,
  updateGarageLocation
);

router.put(
  "/location/current",
  verifyMechanic,
  updateCurrentLocation
);

// AVAILABILITY
router.put(
  "/availability",
  verifyMechanic,
  updateMechanicAvailability
);

// REQUESTS
router.get(
  "/requests",
  verifyMechanic,
  getMechanicRequests
);
router.get(
  "/earnings",
  verifyMechanic,
  getMechanicEarnings
);

router.put(
  "/requests/:id/accept",
  verifyMechanic,
  acceptRequest
);

router.put(
  "/requests/:id/cancel",
  verifyMechanic,
  cancelMechanicRequest
);

router.put(
  "/requests/:id/status",
  verifyMechanic,
  updateRequestStatus
);

export default router;