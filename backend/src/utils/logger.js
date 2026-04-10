import Activity from "../model/activity.js";

/**
 * Log a system activity
 * @param {string} userId - ID of the user performing the action
 * @param {string} action - Descriptive name of the action (e.g., 'User Registration')
 * @param {string} details - Detailed info (e.g., 'New student enrolled: Jane Doe')
 * @param {Object} req - Express request object (optional, for IP/User-Agent)
 */
export const logActivity = async (userId, action, details, req = null) => {
  try {
    const activityData = {
      user: userId,
      action,
      details,
    };

    if (req) {
      activityData.ip = req.ip || req.headers["x-forwarded-for"] || "Unknown";
      activityData.userAgent = req.get("User-Agent") || "Unknown";
    }

    await Activity.create(activityData);
  } catch (error) {
    console.error("Critical: Failed to log system activity", error);
  }
};
