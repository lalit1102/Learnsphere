import express from "express";
import { getAcademicSummary } from "../controllers/reportController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin and Teacher access to academic metrics
router.get("/academic", protect, authorizeRoles("admin", "teacher"), getAcademicSummary);

export default router;
