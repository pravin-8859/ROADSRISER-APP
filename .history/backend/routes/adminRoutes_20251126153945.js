import express from "express";
import { adminLogin, getStats } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authAdmin.js";

const router = express.Router();
router.post("/admin/login", adminLogin);
router.get("/admin/stats", protectAdmin, getStats);

export default router;
