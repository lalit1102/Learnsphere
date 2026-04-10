import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import User from "../model/user.js";

const router = express.Router();

// 1️⃣ Enroll New Teacher (Admin only)
router.post("/enroll", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { 
      name, email, password, contact, 
      designation, specialization, yearsOfExperience, teacherId, bio, subjects 
    } = req.body;

    const teacher = new User({
      name,
      email,
      password,
      contact,
      role: "teacher",
      approvalStatus: "Approved", // Admins skip the pending queue
      teacherDetails: {
        designation,
        specialization,
        yearsOfExperience: Number(yearsOfExperience) || 0,
        teacherId,
        bio
      },
      teacherSubject: subjects || []
    });

    await teacher.save();
    res.status(201).json({ message: "Faculty member enrolled successfully", teacher });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email or Teacher ID already registered" });
    }
    res.status(500).json({ message: error.message });
  }
});

// 2️⃣ Get All Teachers
router.get("/", protect, async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .populate("teacherSubject", "name")
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
