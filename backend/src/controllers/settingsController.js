import Settings from "../model/settings.js";

// 1️⃣ Get Institutional Settings (Singleton)
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Initialize with defaults if not exists
      settings = await Settings.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Update Institutional Settings
export const updateSettings = async (req, res) => {
  try {
    const { schoolName, logoUrl, contactEmail, phone, address } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    settings.schoolName = schoolName || settings.schoolName;
    settings.logoUrl = logoUrl || settings.logoUrl;
    settings.contactEmail = contactEmail || settings.contactEmail;
    settings.phone = phone || settings.phone;
    settings.address = address || settings.address;
    settings.lastUpdatedBy = req.user?._id;

    await settings.save();
    res.status(200).json({ message: "Institutional configuration synchronized", settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

