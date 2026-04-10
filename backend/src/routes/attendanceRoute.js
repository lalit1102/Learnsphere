import express from "express";
import { 
  markAttendance, 
  getClassAttendance, 
  getStudentAttendance,
  getMonthlyReport
} from "../controllers/attendanceController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Mark attendance (Teacher/Admin)
router.post("/mark", protect, authorizeRoles("admin", "teacher"), markAttendance);

// Get class attendance (Admin/Teacher)
router.get("/", protect, authorizeRoles("admin", "teacher"), getClassAttendance);

// Get monthly report summary (Admin/Teacher)
router.get("/report", protect, authorizeRoles("admin", "teacher"), getMonthlyReport);

// Get student attendance (Student/Teacher/Admin)
router.get("/student/:studentId", protect, getStudentAttendance);

export default router;
