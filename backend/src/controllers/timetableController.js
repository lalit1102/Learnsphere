import Timetable from "../model/timetable.js";
import AcademicYear from "../model/academicYear.js";
import Class from "../model/class.js";

/**
 * Helper to check time overlaps
 * Expects HH:mm format
 */
const isOverlapping = (s1, e1, s2, e2) => {
  return s1 < e2 && e1 > s2;
};

// 1️⃣ Create Timetable Slot
export const createTimetableSlot = async (req, res) => {
  try {
    const { classId, subject, teacher, day, startTime, endTime, type } = req.body;

    const currentYear = await AcademicYear.findOne({ isCurrent: true });
    if (!currentYear) return res.status(400).json({ message: "No active academic year" });

    // Conflict Check: Teacher
    if (type !== "Break" && teacher) {
      const teacherConflict = await Timetable.findOne({
        teacher,
        day,
        academicYear: currentYear._id,
        $or: [
          { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
      }).populate("class", "name");

      if (teacherConflict) {
        return res.status(400).json({ 
          message: `Teacher Conflict: Already assigned to ${teacherConflict.class.name} at this time.` 
        });
      }
    }

    // Conflict Check: Class
    const classConflict = await Timetable.findOne({
      class: classId,
      day,
      academicYear: currentYear._id,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (classConflict) {
      return res.status(400).json({ message: "Class Conflict: This room/group already has a scheduled slot at this time." });
    }

    const slot = await Timetable.create({
      class: classId,
      subject: type === "Break" ? null : subject,
      teacher: type === "Break" ? null : teacher,
      day,
      startTime,
      endTime,
      type,
      academicYear: currentYear._id
    });

    res.status(201).json({ message: "Slot scheduled successfully", slot });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Get Timetable for a Class
export const getClassTimetable = async (req, res) => {
  try {
    const { classId } = req.params;
    const timetable = await Timetable.find({ class: classId })
      .populate("subject", "name code")
      .populate("teacher", "name")
      .sort({ startTime: 1 });

    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Delete Slot
export const deleteTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    await Timetable.findByIdAndDelete(id);
    res.status(200).json({ message: "Slot removed from registry" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
