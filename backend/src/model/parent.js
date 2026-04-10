import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    occupation: {
      type: String,
      trim: true,
    },
    relationToStudent: {
      type: String,
      enum: ["Father", "Mother", "Guardian"],
      default: "Guardian",
    },
    alternativeContact: {
      type: String,
      trim: true,
    },
    childGrNumbers: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Parent", parentSchema);
