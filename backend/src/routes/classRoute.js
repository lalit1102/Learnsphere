import express from "express";
import { createClass, getClasses, updateClass, deleteClass } from "../controllers/classController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only management
router.post("/", protect, authorizeRoles("admin"), createClass);
router.get("/", protect, getClasses); // Accessible by teachers/admins
router.put("/:id", protect, authorizeRoles("admin"), updateClass);
router.delete("/:id", protect, authorizeRoles("admin"), deleteClass);

export default router;
