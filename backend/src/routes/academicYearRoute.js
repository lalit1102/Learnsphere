import express from "express";
import { getCurrentAcademicYear, getAllAcademicYears, createAcademicYear, setCurrentAcademicYear } from "../controllers/academicYearController.js";
import { protect, authorizeRoles, superAdminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Publicly accessible for auth initialization
router.get("/current", getCurrentAcademicYear);

// Management (Admin only)
router.get("/", protect, authorizeRoles("admin"), getAllAcademicYears);

// Governance (Super Admin only)
router.post("/", protect, authorizeRoles("admin"), superAdminOnly, createAcademicYear);
router.put("/:id/current", protect, authorizeRoles("admin"), superAdminOnly, setCurrentAcademicYear);

export default router;
