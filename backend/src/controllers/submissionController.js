import Submission from "../model/submission.js";
import Assignment from "../model/assignment.js";

// 1️⃣ Submit Assignment (Student only)
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Submission file is required" });
    }

    const fileUrl = file.path.replace(/\\/g, "/");

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // Check for existing submission (One per student per assignment)
    let submission = await Submission.findOne({ assignment: assignmentId, student: req.user._id });

    if (submission) {
      // Update existing submission
      submission.fileUrl = fileUrl;
      submission.submittedAt = Date.now();
      await submission.save();
    } else {
      // Create new submission
      submission = await Submission.create({
        assignment: assignmentId,
        student: req.user._id,
        fileUrl,
      });

      // Update assignment submissions array
      await Assignment.findByIdAndUpdate(assignmentId, { $push: { submissions: submission._id } });
    }

    res.status(201).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Get Submissions for an Assignment (Teacher only)
export const getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Grade Submission (Teacher only)
export const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      id,
      { grade, feedback, status: "Graded" },
      { new: true }
    );

    if (!submission) return res.status(404).json({ message: "Submission not found" });

    res.status(200).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
