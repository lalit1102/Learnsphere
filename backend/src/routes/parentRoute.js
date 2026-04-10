import express from "express";
import { enrollParent, getParents, decommissionParent } from "../controllers/parentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only guardian management
router.post("/enroll", protect, authorizeRoles("admin"), enrollParent);
router.get("/", protect, authorizeRoles("admin", "teacher"), getParents);
router.delete("/:id", protect, authorizeRoles("admin"), decommissionParent);

export default router;
