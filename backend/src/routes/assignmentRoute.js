import express from "express";
import { 
  createAssignment, 
  getAssignments, 
  getAssignmentDetail 
} from "../controllers/assignmentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create assignment (Teacher only)
router.post(
  "/", 
  protect, 
  authorizeRoles("teacher", "admin"), 
  upload.single("assignmentFile"), 
  createAssignment
);

// Get assignments (By Role)
router.get("/", protect, getAssignments);

// Get details
router.get("/:id", protect, getAssignmentDetail);

export default router;
