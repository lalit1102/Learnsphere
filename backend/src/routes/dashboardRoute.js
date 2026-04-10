import express from "express";
import { getDashboardStats, getAdminAnalytics } from "../controllers/dashboardController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Publicly protected stats for dashboard
router.get("/stats", protect, getDashboardStats);

// Analytics trend data (Admin only)
router.get("/analytics", protect, authorizeRoles("admin"), getAdminAnalytics);

export default router;
