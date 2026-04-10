import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/model/user.js";

dotenv.config({ path: "./.env" });

const approveAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const result = await User.updateMany(
      { role: "admin" },
      { $set: { approvalStatus: "Approved", isActive: true } }
    );

    console.log(`Success: Updated ${result.modifiedCount} admin users to 'Approved'.`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating admin users:", error);
    process.exit(1);
  }
};

approveAdmin();
