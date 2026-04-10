import express from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Fetch settings for Navbar/Logo
router.get("/", getSettings);

// Authorized: Administrative updates
router.put("/update", protect, authorizeRoles("admin"), updateSettings);

export default router;
