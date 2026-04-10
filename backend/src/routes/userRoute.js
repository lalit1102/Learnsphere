// src/routes/userRoutes.js
import express from "express";
const router = express.Router();

// Controllers Import
import {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUser,
  getUsers,
  deleteUser,
  logoutUser,
  adminUpdateUser,
  getStudentByGrNumber,
  getMyStudents,
  getMyLearning,
} from "../controllers/userControllers.js";

// Middleware Import
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

// ================= AUTH ROUTES =================

// TEMP: first admin registration (remove after first admin is created)
// router.post("/register-admin-first-time", register);

// Admin only:Register new users (Student/Teacher)
router.post("/register", protect, authorizeRoles("admin"), register);

// Login / Google Login / Forgot Password / Reset / Logout
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/logout", logoutUser);

// ================= USER ROUTES =================
// Get & Update own profile (all logged-in users)
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUser);

// Teacher/Student specific data
router.get("/my-students", protect, authorizeRoles("teacher"), getMyStudents);
router.get("/my-learning", protect, authorizeRoles("student"), getMyLearning);

// ================= ADMIN ROUTES =================
// Get all users (Admin only)
router.route("/").get(protect, authorizeRoles("admin"), getUsers);

// Update a user (Admin only)
router.put("/:id", protect, authorizeRoles("admin"), adminUpdateUser);

// Delete a user (Admin only)
router.delete("/delete/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;











