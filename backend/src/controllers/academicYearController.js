import AcademicYear from "../model/academicYear.js";

// 1️⃣ Get Current Academic Year
export const getCurrentAcademicYear = async (req, res) => {
  try {
    const year = await AcademicYear.findOne({ isCurrent: true, isActive: true });
    
    if (!year) {
      return res.status(404).json({ message: "No active academic year found" });
    }

    res.status(200).json(year);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Get All Academic Years (Admin only)
export const getAllAcademicYears = async (req, res) => {
  try {
    const years = await AcademicYear.find().sort({ startDate: -1 });
    res.status(200).json(years);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Create Academic Year (Super Admin only)
export const createAcademicYear = async (req, res) => {
  try {
    const { name, startDate, endDate, isCurrent } = req.body;
    const year = new AcademicYear({ name, startDate, endDate, isCurrent });
    await year.save();
    res.status(201).json({ message: "Academic year established", year });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 4️⃣ Set Current Academic Year (Super Admin only)
export const setCurrentAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const year = await AcademicYear.findById(id);
    if (!year) return res.status(404).json({ message: "Academic year not found" });

    year.isCurrent = true;
    await year.save(); // The pre-save hook handles setting others to false
    res.status(200).json({ message: "Current academic year updated", year });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
