import express from "express";
import { loginLimiter } from "../middleware/rateLimit.js";
import {
  adminLogin,
  refreshAdminToken,
  adminLogout,
  getAdminProfile,
  getDashboardStats,
  getUsers,
  getUserById,
  getMechanics,
  getMechanicById,
  getRequests,
  getRequestById,
  getCancellationHistory,
} from "../controllers/adminController.js";

import { verifyAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// =====================================================
// AUTH
// =====================================================

router.post(
  "/login",
  loginLimiter,
  adminLogin
);

router.post("/refresh", refreshAdminToken);

router.post("/logout", adminLogout);

// =====================================================
// ADMIN PROFILE
// =====================================================

router.get(
  "/me",
  verifyAdmin,
  getAdminProfile
);

// =====================================================
// DASHBOARD
// =====================================================

router.get(
  "/dashboard",
  verifyAdmin,
  getDashboardStats
);

// =====================================================
// USERS
// =====================================================

router.get(
  "/users",
  verifyAdmin,
  getUsers
);

router.get(
  "/users/:id",
  verifyAdmin,
  getUserById
);

// =====================================================
// MECHANICS
// =====================================================

router.get(
  "/mechanics",
  verifyAdmin,
  getMechanics
);

router.get(
  "/mechanics/:id",
  verifyAdmin,
  getMechanicById
);

// =====================================================
// REQUESTS
// =====================================================

// =====================================================
// CANCELLATION HISTORY
// =====================================================

router.get(
  "/cancellations",
  verifyAdmin,
  getCancellationHistory
);

router.get(
  "/requests",
  verifyAdmin,
  getRequests
);

router.get(
  "/requests/:id",
  verifyAdmin,
  getRequestById
);

export default router;