import express from "express";
import { enrollStudent, getStudents, decommissionStudent } from "../controllers/studentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only student management
router.post("/enroll", protect, authorizeRoles("admin"), enrollStudent);
router.get("/", protect, authorizeRoles("admin", "teacher"), getStudents);
router.delete("/:id", protect, authorizeRoles("admin"), decommissionStudent);

export default router;
