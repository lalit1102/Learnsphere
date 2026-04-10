import express from "express";
import { getActivities } from "../controllers/activityController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only access to granular system logs
router.get("/", protect, authorizeRoles("admin"), getActivities);

export default router;
