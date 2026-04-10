import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    monthYear: {
      type: String, // format: "YYYY-MM"
      required: true,
      index: true,
    },
    baseSalary: {
      type: Number,
      default: 0,
    },
    allowances: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    attendancePercentage: {
      type: Number,
      default: 100, // Simulated mock default
    },
    netSalary: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    paymentDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent duplicate payroll records for the same staff member in the same month
salarySchema.index({ staff: 1, monthYear: 1 }, { unique: true });

export default mongoose.model("Salary", salarySchema);
