import express from "express";
import { 
  createTimetableSlot, 
  getClassTimetable, 
  deleteTimetableSlot 
} from "../controllers/timetableController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin only creation/deletion
router.post("/", protect, authorizeRoles("admin"), createTimetableSlot);
router.delete("/:id", protect, authorizeRoles("admin"), deleteTimetableSlot);

// Class-specific retrieval (Admins/Teachers/Students)
router.get("/class/:classId", protect, getClassTimetable);

export default router;
