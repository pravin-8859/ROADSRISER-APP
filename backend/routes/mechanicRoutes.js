import express from "express";

import {
  sendOtp,
  mechanicSignup,
  mechanicLogin,
  logout,
} from "../controllers/mechanicController.js";

import {
  getMechanicRequests,
  acceptRequest,
  updateRequestStatus,
} from "../controllers/requestController.js";

import { verifyMechanic } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= AUTH =================

router.post("/send-otp", sendOtp);

router.post("/register", mechanicSignup);

router.post("/login", mechanicLogin);

router.post("/logout", logout);

// ================= PROTECTED REQUESTS =================

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