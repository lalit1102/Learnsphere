// src/controllers/userControllers.js
import User from "../model/user.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// 🍪 Token Helper: JWT જનરેટ કરી Cookie માં સેટ કરવા માટે
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.status(statusCode).cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  }).json({ success: true, user });
};

// 1️⃣ Register (Admin only)
// 1️⃣ Register (Admin can create any role)
export const register = async (req, res) => {
  try {
    const { name, email, password, role, studentDetails, teacherDetails, parentDetails } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Only allow roles defined in schema
    const allowedRoles = ["admin", "teacher", "student", "parent"];
    if (!allowedRoles.includes(role)) return res.status(400).json({ message: "Invalid role" });

    // Create user with conditional fields
    const user = await User.create({
      name,
      email,
      password,
      role,
      authProvider: "local",
      studentDetails: role === "student" ? studentDetails : undefined,
      teacherDetails: role === "teacher" ? teacherDetails : undefined,
      parentDetails: role === "parent" ? parentDetails : undefined,
    });

    sendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const register = async (req, res, next) => {
//   try {
//     const { name, email, password, role } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const user = await User.create({ name, email, password, role, authProvider: "local" });
//     sendToken(user, 201, res);
//   } catch (error) {
//     next(error); // passes error to Express error handler
//   }
// };

// 2️⃣ Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Email not found" });

    if (user.authProvider === "google") {
      return res.status(400).json({ message: "Please login with Google" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    if (user.approvalStatus !== "Approved") {
      return res.status(403).json({ 
        message: `Your account is currently ${user.approvalStatus.toLowerCase()}. Please contact administration.` 
      });
    }

    user.lastLogin = Date.now();
    await user.save();
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Google Login
export const googleLogin = async (req, res) => {
  try {
    const { name, email, googleId, profileImage } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name, email, googleId,
        authProvider: "google",
        profileImage,
        approvalStatus: "Approved", // Autoproved for social logins unless restricted
      });
    }

    if (user.approvalStatus !== "Approved") {
      return res.status(403).json({ 
        message: `Your account is currently ${user.approvalStatus.toLowerCase()}. Please contact administration.` 
      });
    }

    user.lastLogin = Date.now();
    await user.save();
    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4️⃣ Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.authProvider === "google") {
      return res.status(400).json({ message: "Google users don't need password reset" });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    console.log("Reset Link:", resetUrl);

    res.status(200).json({ success: true, message: "Reset link generated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5️⃣ Get Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6️⃣ Update User
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.contact = req.body.contact || user.contact;
      if (req.body.password && user.authProvider === "local") {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({ success: true, user: updatedUser });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7️⃣ Get All Users (Admin only) - Now with filtering, search and pagination
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role;
    const search = req.query.search;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate("teacherSubject", "name code")
      .populate("studentClass", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8️⃣ Admin Update User (Admin only)
export const adminUpdateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { 
      name, 
      contact, 
      isActive, 
      approvalStatus,
      studentDetails, 
      teacherDetails, 
      studentClass, 
      teacherSubject 
    } = req.body;

    if (name) user.name = name;
    if (contact !== undefined) user.contact = contact;
    if (isActive !== undefined) user.isActive = isActive;
    if (approvalStatus) user.approvalStatus = approvalStatus;

    // Role-specific updates
    if (user.role === "student") {
      if (studentDetails) user.studentDetails = { ...user.studentDetails, ...studentDetails };
      if (studentClass !== undefined) user.studentClass = studentClass;
    }

    if (user.role === "teacher") {
      if (teacherDetails) user.teacherDetails = { ...user.teacherDetails, ...teacherDetails };
      if (teacherSubject !== undefined) user.teacherSubject = teacherSubject;
    }

    const updatedUser = await user.save();
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8️⃣ Delete User (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 9️⃣ Logout
export const logoutUser = (req, res) => {
  res.cookie("token", null, { expires: new Date(0), httpOnly: true });
  res.status(200).json({ success: true, message: "Logged out" });
};

// 10️⃣ Reset Password
export const resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;

    // Hash the token to compare with DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find user with this token and not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }

    // Update password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 11️⃣ Search Student by GR Number (For Parents)
export const getStudentByGrNumber = async (req, res) => {
  try {
    const { grNumber } = req.params;
    const student = await User.findOne({ 
      role: "student", 
      "studentDetails.grNumber": grNumber 
    }).populate("studentClass", "name");

    if (!student) {
      return res.status(404).json({ message: "Student not found with this GR Number" });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 12️⃣ Get Students for Assigned Class (Teacher only)
export const getMyStudents = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // 1. Find the class where this teacher is the classTeacher
    const Class = mongoose.model("Class");
    const assignedClass = await Class.findOne({ classTeacher: teacherId });

    if (!assignedClass) {
      return res.status(200).json({ success: true, students: [], message: "No class assigned to you" });
    }

    // 2. Fetch all students who are in this class
    const students = await User.find({ 
      role: "student", 
      studentClass: assignedClass._id 
    }).populate("studentClass", "name");

    res.status(200).json({ 
      success: true, 
      className: assignedClass.name,
      students 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 13️⃣ Get Student Learning Info (Student only)
export const getMyLearning = async (req, res) => {
  try {
    const student = await User.findById(req.user._id)
      .populate({
        path: "studentClass",
        populate: {
          path: "subjects",
          select: "name code teacher",
          populate: { path: "teacher", select: "name email" }
        }
      });

    if (!student.studentClass) {
      return res.status(200).json({ success: true, message: "No class assigned yet" });
    }

    res.status(200).json({
      success: true,
      classInfo: {
        name: student.studentClass.name,
        academicYear: student.studentClass.academicYear,
      },
      subjects: student.studentClass.subjects,
      grNumber: student.studentDetails?.grNumber,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
