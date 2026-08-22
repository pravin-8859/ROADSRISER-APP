import express from "express";

import {
  sendOtp,
  mechanicSignup,
  mechanicLogin,
  refreshMechanicToken,
  logout,
  getMechanicProfile,
  updateGarageLocation,
  updateCurrentLocation,
  updateMechanicAvailability,
  getNearbyMechanics,
} from "../controllers/mechanicController.js";

import {
  getMechanicRequests,
  acceptRequest,
  updateRequestStatus,
} from "../controllers/requestController.js";

import { verifyMechanic } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ========================= AUTH ========================= */

router.post("/send-otp", sendOtp);

router.post("/register", mechanicSignup);

router.post("/login", mechanicLogin);

router.post("/refresh", refreshMechanicToken);

router.post("/logout", logout);

// =====================================================
// NEARBY MECHANICS
// =====================================================

router.get(
  "/nearby",
  getNearbyMechanics
);

/* ========================= PROFILE ========================= */

router.get(
  "/me",
  verifyMechanic,
  getMechanicProfile
);

/* ========================= LOCATION ========================= */

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

/* ========================= REQUESTS ========================= */

// Get pending + assigned requests
router.get(
  "/requests",
  verifyMechanic,
  getMechanicRequests
);

// Accept pending request
router.put(
  "/requests/:id/accept",
  verifyMechanic,
  acceptRequest
);

// Update request status
router.put(
  "/requests/:id/status",
  verifyMechanic,
  updateRequestStatus
);

export default router;