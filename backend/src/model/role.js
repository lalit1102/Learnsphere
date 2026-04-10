import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["admin", "teacher", "student", "parent"],
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    permissions: [{
      type: String, // String-based permission identifiers like "view_reports", "manage_attendance"
    }],
    isSystemFixed: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
