import User from "../model/user.js";
import Class from "../model/class.js";
import Attendance from "../model/attendance.js";
import Assignment from "../model/assignment.js";
import Submission from "../model/submission.js";

// 1️⃣ Get Unified Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const { role, _id, studentClass } = req.user;
    let stats = {};

    if (role === "admin") {
      const [userCount, classCount, studentCount, teacherCount] = await Promise.all([
        User.countDocuments(),
        Class.countDocuments(),
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "teacher" }),
      ]);

      // Calculate overall attendance % for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const attendanceStats = await Attendance.aggregate([
        { $match: { date: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } }
          }
        }
      ]);

      const attendanceRate = attendanceStats.length > 0 
        ? Math.round((attendanceStats[0].present / attendanceStats[0].total) * 100) 
        : 0;

      stats = {
        totalUsers: userCount,
        activeClasses: classCount,
        studentRoster: studentCount,
        facultySize: teacherCount,
        overallAttendance: attendanceRate,
        recentActivity: ["User registry updated", "New academic class formed", "Attendance sync complete"]
      };
    } else if (role === "student") {
      // Student specific progress
      const assignmentCount = await Assignment.countDocuments({ class: studentClass });
      const submissionCount = await Submission.countDocuments({ student: _id });
      
      stats = {
        assignmentsTotal: assignmentCount,
        submissionsDone: submissionCount,
        progress: assignmentCount > 0 ? Math.round((submissionCount / assignmentCount) * 100) : 0
      };
    }

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Get Analytics for Charts (Admin only)
export const getAdminAnalytics = async (req, res) => {
  try {
    // Attendance trend for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      last7Days.push(d);
    }

    const trends = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const count = await Attendance.countDocuments({
          date: { $gte: date, $lt: nextDay },
          status: "present"
        });

        return {
          day: date.toLocaleDateString("en-US", { weekday: "short" }),
          present: count
        };
      })
    );

    res.status(200).json({ attendanceTrends: trends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
