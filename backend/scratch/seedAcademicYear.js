import mongoose from "mongoose";
import dotenv from "dotenv";
import AcademicYear from "../src/model/academicYear.js";

dotenv.config({ path: "./.env" });

const seedYear = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existingYear = await AcademicYear.findOne({ name: "2026-27" });
    if (existingYear) {
      console.log("Academic year 2026-27 already exists.");
      process.exit(0);
    }

    await AcademicYear.create({
      name: "2026-27",
      startDate: new Date("2026-06-01"),
      endDate: new Date("2027-04-30"),
      isCurrent: true,
      isActive: true,
    });

    console.log("Success: Initial academic year 2026-27 seeded as current.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding academic year:", error);
    process.exit(1);
  }
};

seedYear();
