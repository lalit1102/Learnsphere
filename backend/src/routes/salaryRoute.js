import express from "express";
import { getSalariesByMonth, updateSalaryConfig, markSalaryPaid } from "../controllers/salaryController.js";
import { protect, authorizeRoles, superAdminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Extract all endpoints behind the Administrator / Master Governance gate
router.use(protect);
router.use(authorizeRoles("admin")); // Must be at least generic Admin

// Route: Get / Auto-Initialize Salary records for a given YYYY-MM
router.get("/", superAdminOnly, getSalariesByMonth); // Lock to super admin/accountant level

// Route: Update base limits payload (Super Admin)
router.put("/:id/config", superAdminOnly, updateSalaryConfig);

// Route: Mark as Paid execution
router.put("/:id/pay", superAdminOnly, markSalaryPaid);

export default router;
