import Assignment from "../model/assignment.js";
import path from "path";

// 1️⃣ Create Assignment (Teacher only)
export const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, classId, subjectId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Assignment file is required" });
    }

    // Convert local path to a URL-friendly path
    const fileUrl = file.path.replace(/\\/g, "/"); 

    const assignment = await Assignment.create({
      title,
      description,
      fileUrl,
      dueDate,
      class: classId,
      subject: subjectId,
      teacher: req.user._id,
    });

    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Get Assignments (By Role)
export const getAssignments = async (req, res) => {
  try {
    const { role, _id, studentClass } = req.user;
    let query = {};

    if (role === "teacher") {
      query.teacher = _id;
    } else if (role === "student") {
      if (!studentClass) return res.status(200).json([]);
      query.class = studentClass;
    }

    const assignments = await Assignment.find(query)
      .populate("class", "name")
      .populate("subject", "name")
      .populate("teacher", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Get Assignment Details (with Submissions if teacher)
export const getAssignmentDetail = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("class", "name")
      .populate("subject", "name")
      .populate("teacher", "name");

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
