import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      // Optional because of 'Break' slots
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // Optional because of 'Break' slots
    },
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      required: true,
    },
    startTime: {
      type: String, // format "HH:mm"
      required: true,
    },
    endTime: {
      type: String, // format "HH:mm"
      required: true,
    },
    type: {
      type: String,
      enum: ["Lecture", "Break", "Lab"],
      default: "Lecture",
    },
    academicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexing for conflict checks and retrieval
timetableSchema.index({ class: 1, day: 1, startTime: 1 });
timetableSchema.index({ teacher: 1, day: 1, startTime: 1 });

export default mongoose.model("Timetable", timetableSchema);
