import User from "../model/user.js";
import Parent from "../model/parent.js";
import Student from "../model/student.js";
import mongoose from "mongoose";

// 1️⃣ Enroll New Parent
export const enrollParent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { 
      name, email, password, contact, 
      occupation, relationToStudent, alternativeContact, childGrNumbers 
    } = req.body;

    // 1. Validation: Check if GR Numbers exist in students registry
    if (childGrNumbers && childGrNumbers.length > 0) {
      const existingStudents = await Student.find({ grNumber: { $in: childGrNumbers } }).session(session);
      const foundGrs = existingStudents.map(s => s.grNumber);
      const missingGrs = childGrNumbers.filter(gr => !foundGrs.includes(gr));

      if (missingGrs.length > 0) {
        throw new Error(`The following GR Numbers do not exist: ${missingGrs.join(", ")}`);
      }
    }

    // 2. Create User
    const user = new User({
      name,
      email,
      password,
      contact,
      role: "parent",
    });
    await user.save({ session });

    // 3. Create Parent Record
    const parent = new Parent({
      user: user._id,
      occupation,
      relationToStudent,
      alternativeContact,
      childGrNumbers: childGrNumbers || []
    });
    await parent.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Guardian enrolled successfully", user, parent });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
};

// 2️⃣ Get All Parents
export const getParents = async (req, res) => {
  try {
    const parents = await Parent.find()
      .populate("user", "name email contact isActive")
      .sort({ createdAt: -1 });

    // We can also fetch student names based on grNumbers if needed elsewhere
    res.status(200).json(parents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Decommission Parent
export const decommissionParent = async (req, res) => {
  try {
    const { id } = req.params;
    const parent = await Parent.findById(id);
    if (!parent) return res.status(404).json({ message: "Guardian record not found" });

    await User.findByIdAndDelete(parent.user);
    await Parent.findByIdAndDelete(id);

    res.status(200).json({ message: "Guardian profile successfully decommissioned" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
