import Activity from "../model/activity.js";

// 1️⃣ Get Unified Activity Logs (Admin only)
export const getActivities = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const activities = await Activity.find()
      .populate("user", "name email role")
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Activity.countDocuments();

    res.status(200).json({
      activities,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalEntries: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
