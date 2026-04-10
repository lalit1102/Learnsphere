import User from "../model/user.js";
import Student from "../model/student.js";
import mongoose from "mongoose";

// 1️⃣ Enroll New Student
export const enrollStudent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { 
      name, email, password, contact, 
      grNumber, parentName, parentPhone, address, classId 
    } = req.body;

    // 1. Create User
    const user = new User({
      name,
      email,
      password,
      contact,
      role: "student",
      studentClass: classId || null
    });
    
    // Manual hashing check or trigger save (Assuming pre-save hook handles it)
    await user.save({ session });

    // 2. Create Student Record
    const student = new Student({
      user: user._id,
      grNumber,
      parentName,
      parentPhone,
      address
    });
    await student.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Student enrolled successfully", user, student });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    if (error.code === 11000) {
      if (error.keyPattern?.email) return res.status(400).json({ message: "Email already registered" });
      if (error.keyPattern?.grNumber) return res.status(400).json({ message: "GR Number already in use" });
    }
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Get All Students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate({
        path: "user",
        select: "name email contact profileImage isActive studentClass",
        populate: { path: "studentClass", select: "name" }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Delete Student
export const decommissionStudent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params; // Student ID
    const student = await Student.findById(id).session(session);
    if (!student) return res.status(404).json({ message: "Student record not found" });

    // Delete both Student and User
    await User.findByIdAndDelete(student.user).session(session);
    await Student.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Student successfully decommissioned from registry" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};
