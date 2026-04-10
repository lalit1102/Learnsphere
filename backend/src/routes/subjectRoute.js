import express from "express";
import { createSubject, getSubjects, updateSubject, deleteSubject } from "../controllers/subjectController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only curriculum management
router.post("/", protect, authorizeRoles("admin"), createSubject);
router.get("/", protect, getSubjects); // Accessible by teachers/admins
router.put("/:id", protect, authorizeRoles("admin"), updateSubject);
router.delete("/:id", protect, authorizeRoles("admin"), deleteSubject);

export default router;
