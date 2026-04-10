import Subject from "../model/subject.js";
import Class from "../model/class.js";

// 1️⃣ Create Subject
export const createSubject = async (req, res) => {
  try {
    const { name, code, category, credits, teacher, classes } = req.body;

    const newSubject = await Subject.create({
      name,
      code,
      category,
      credits,
      teacher: teacher || []
    });

    // If classes are provided, update each class to include this subject
    if (classes && classes.length > 0) {
      await Class.updateMany(
        { _id: { $in: classes } },
        { $addToSet: { subjects: newSubject._id } }
      );
    }

    res.status(201).json({ message: "Subject established successfully", subject: newSubject });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A subject with this code already exists." });
    }
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Get All Subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("teacher", "name email")
      .sort({ name: 1 });

    // Fetch class associations for each subject
    const subjectsWithClasses = await Promise.all(
      subjects.map(async (subj) => {
        const assignedClasses = await Class.find({ subjects: subj._id }).select("name");
        return {
          ...subj._doc,
          assignedClasses
        };
      })
    );

    res.status(200).json(subjectsWithClasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Update Subject
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { classes, ...updateData } = req.body;

    const updatedSubject = await Subject.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedSubject) return res.status(404).json({ message: "Subject not found" });

    // Handle class mapping updates
    if (classes) {
      // 1. Remove subject from all classes it was previously in
      await Class.updateMany(
        { subjects: id },
        { $pull: { subjects: id } }
      );
      
      // 2. Add subject to new set of classes
      if (classes.length > 0) {
        await Class.updateMany(
          { _id: { $in: classes } },
          { $addToSet: { subjects: id } }
        );
      }
    }

    res.status(200).json({ message: "Subject profile synchronized", subject: updatedSubject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4️⃣ Delete Subject
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Cleanup class associations
    await Class.updateMany(
      { subjects: id },
      { $pull: { subjects: id } }
    );

    await Subject.findByIdAndDelete(id);
    res.status(200).json({ message: "Subject successfully removed from curriculum" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
