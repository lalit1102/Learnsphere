import express from "express";
import { getAllRoles, updateRolePermissions } from "../controllers/roleController.js";
import { protect, authorizeRoles, superAdminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get the system roles (Can be restricted or available to any admin/manager who needs to know permissions)
router.get("/", protect, authorizeRoles("admin"), getAllRoles);

// Update Role Permissions (Super Admin exclusivity)
router.put("/:id/permissions", protect, authorizeRoles("admin"), superAdminOnly, updateRolePermissions);

export default router;
