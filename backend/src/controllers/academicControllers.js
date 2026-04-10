import Subject from "../model/subject.js";
import Class from "../model/class.js";

// Subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ isActive: true }).select("name _id code");
    res.json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Classes
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().select("name _id");
    res.json({ success: true, classes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
