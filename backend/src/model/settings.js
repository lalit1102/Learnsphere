import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      default: "Learnsphere Academy",
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
