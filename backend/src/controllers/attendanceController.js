import mongoose from "mongoose";
import Attendance from "../model/attendance.js";

// 1️⃣ Mark Attendance (Bulk)
export const markAttendance = async (req, res) => {
  try {
    const { classId, date, attendanceData, subjectId, markedBy } = req.body;

    if (!classId || !date || !attendanceData || !markedBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const attendanceRecords = await Promise.all(
      attendanceData.map(async (record) => {
        const query = {
          student: record.studentId,
          class: classId,
          date: new Date(date),
          subject: subjectId || null,
        };

        const update = {
          status: record.status,
          remarks: record.remarks,
          markedBy,
        };

        return await Attendance.findOneAndUpdate(query, update, {
          upsert: true,
          new: true,
        });
      })
    );

    res.status(200).json({
      success: true,
      message: "Attendance processed successfully",
      records: attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Get Class Attendance
export const getClassAttendance = async (req, res) => {
  try {
    const { classId, date, subjectId } = req.query;

    const query = {
      class: classId,
      date: new Date(date),
    };

    if (subjectId && subjectId !== "none") {
      query.subject = subjectId;
    }

    const records = await Attendance.find(query).populate("student", "name email");
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Get Student Attendance History
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const history = await Attendance.find({ student: studentId })
      .populate("subject", "name")
      .populate("markedBy", "name")
      .sort({ date: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4️⃣ Get Monthly Attendance Report (Summary)
export const getMonthlyReport = async (req, res) => {
  try {
    const { classId, year, month } = req.query;

    if (!classId || !year || !month) {
      return res.status(400).json({ message: "ClassId, year and month are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const summary = await Attendance.aggregate([
      {
        $match: {
          class: new mongoose.Types.ObjectId(classId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$student",
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] } },
          total: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" },
      {
        $project: {
          studentName: "$studentInfo.name",
          email: "$studentInfo.email",
          present: 1,
          absent: 1,
          late: 1,
          total: 1,
          percentage: {
            $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 1]
          }
        }
      },
      { $sort: { studentName: 1 } }
    ]);

    res.status(200).json({
      success: true,
      month: startDate.toLocaleString("default", { month: "long" }),
      year,
      summary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

