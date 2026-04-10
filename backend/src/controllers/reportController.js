import Submission from "../model/submission.js";
import Assignment from "../model/assignment.js";
import Class from "../model/class.js";
import Subject from "../model/subject.js";

// Grade to Numeric Mapping
const GRADE_MAP = {
  "A+": 95, "A": 85,
  "B+": 75, "B": 65,
  "C+": 55, "C": 45,
  "D": 35, "F": 0
};

// 1️⃣ Get Academic Summary
export const getAcademicSummary = async (req, res) => {
  try {
    // Fetch all graded submissions with related assignment info
    const submissions = await Submission.find({ status: "Graded" })
      .populate({
        path: "assignment",
        populate: [
          { path: "class", select: "name" },
          { path: "subject", select: "name" }
        ]
      })
      .populate("student", "name email");

    if (!submissions || submissions.length === 0) {
      return res.status(200).json({ 
        message: "No graded submissions found", 
        stats: { classPerformance: [], subjectPerformance: [], gradeDistribution: [] } 
      });
    }

    // Processing Logic
    const classStats = {};
    const subjectStats = {};
    const gradeCounts = { "A+": 0, "A": 0, "B+": 0, "B": 0, "C+": 0, "C": 0, "D": 0, "F": 0 };
    
    submissions.forEach(sub => {
      const numericGrade = GRADE_MAP[sub.grade] || 0;
      const className = sub.assignment.class.name;
      const subjectName = sub.assignment.subject.name;

      // Class Aggregation
      if (!classStats[className]) classStats[className] = { sum: 0, count: 0 };
      classStats[className].sum += numericGrade;
      classStats[className].count += 1;

      // Subject Aggregation
      if (!subjectStats[subjectName]) subjectStats[subjectName] = { sum: 0, count: 0 };
      subjectStats[subjectName].sum += numericGrade;
      subjectStats[subjectName].count += 1;

      // Grade Distribution
      if (gradeCounts[sub.grade] !== undefined) gradeCounts[sub.grade] += 1;
    });

    // Formatting for Frontend (Recharts)
    const classPerformance = Object.keys(classStats).map(name => ({
      name,
      average: Math.round(classStats[name].sum / classStats[name].count)
    })).sort((a, b) => b.average - a.average);

    const subjectPerformance = Object.keys(subjectStats).map(name => ({
      name,
      average: Math.round(subjectStats[name].sum / subjectStats[name].count)
    })).sort((a, b) => b.average - a.average);

    const gradeDistribution = Object.keys(gradeCounts).map(grade => ({
      name: grade,
      value: gradeCounts[grade]
    }));

    res.status(200).json({
      success: true,
      stats: {
        classPerformance,
        subjectPerformance,
        gradeDistribution,
        totalGraded: submissions.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
