import express from "express";
import { 
  submitAssignment, 
  getSubmissions, 
  gradeSubmission 
} from "../controllers/submissionController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Submit assignment (Student only)
router.post(
  "/", 
  protect, 
  authorizeRoles("student"), 
  upload.single("submissionFile"), 
  submitAssignment
);

// Get submissions for an assignment (Teacher/Admin only)
router.get("/assignment/:assignmentId", protect, authorizeRoles("teacher", "admin"), getSubmissions);

// Grade a submission (Teacher/Admin only)
router.put("/grade/:id", protect, authorizeRoles("teacher", "admin"), gradeSubmission);

export default router;
