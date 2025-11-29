import express from "express";
import { adminLogin, getStats } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/protectAdmin.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
router.get("/admin/stats", protectAdmin, getStats);

// (optional) create protected admin CRUD routes here

export default router;
