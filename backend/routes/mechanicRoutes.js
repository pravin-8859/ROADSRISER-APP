import express from "express";

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
  acceptRequest,
  cancelMechanicRequest,
  updateRequestStatus,
} from "../controllers/requestController.js";

import { verifyMechanic } from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================================
// AUTH
// =====================================================

router.post(
  "/send-otp",
  sendOtp
);

router.post(
  "/register",
  mechanicSignup
);

router.post(
  "/login",
  mechanicLogin
);

router.post(
  "/refresh",
  refreshMechanicToken
);

router.post(
  "/logout",
  logout
);

// =====================================================
// PROFILE
// =====================================================

router.get(
  "/me",
  verifyMechanic,
  getMechanicProfile
);

router.put(
  "/me",
  verifyMechanic,
  updateMechanicProfile
);
// =====================================================
// LOCATION
// =====================================================

// Permanent garage/shop location
router.put(
  "/location/garage",
  verifyMechanic,
  updateGarageLocation
);

// Live/current mechanic location
router.put(
  "/location/current",
  verifyMechanic,
  updateCurrentLocation
);

// Online / offline
router.put(
  "/availability",
  verifyMechanic,
  updateMechanicAvailability
);

// =====================================================
// REQUESTS
// =====================================================

// Get pending + assigned requests
router.get(
  "/requests",
  verifyMechanic,
  getMechanicRequests
);

// Accept request
router.put(
  "/requests/:id/accept",
  verifyMechanic,
  acceptRequest
);

// Cancel assigned request
router.put(
  "/requests/:id/cancel",
  verifyMechanic,
  cancelMechanicRequest
);

// Update request status
router.put(
  "/requests/:id/status",
  verifyMechanic,
  updateRequestStatus
);

export default router;