import Class from "../model/class.js";
import AcademicYear from "../model/academicYear.js";

// 1️⃣ Create Class
export const createClass = async (req, res) => {
  try {
    const { name, roomNumber, capacity, classTeacher } = req.body;

    // Get current academic year
    const currentYear = await AcademicYear.findOne({ isCurrent: true });
    if (!currentYear) {
      return res.status(400).json({ message: "No active academic year found. Please create one first." });
    }

    const newClass = await Class.create({
      name,
      roomNumber,
      capacity,
      classTeacher,
      academicYear: currentYear._id,
    });

    res.status(201).json({ message: "Class created successfully", class: newClass });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A class with this name already exists in the current academic year." });
    }
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Get All Classes
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("classTeacher", "name email")
      .populate("academicYear", "name")
      .sort({ name: 1 });

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Update Class
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedClass = await Class.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedClass) return res.status(404).json({ message: "Class not found" });

    res.status(200).json({ message: "Class updated successfully", class: updatedClass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4️⃣ Delete Class
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const classToDelete = await Class.findById(id);
    
    if (!classToDelete) return res.status(404).json({ message: "Class not found" });

    if (classToDelete.students.length > 0) {
      return res.status(400).json({ message: "Cannot delete a class that has assigned students." });
    }

    await Class.findByIdAndDelete(id);
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
