import express from "express";
import { protect, authorizeRoles, superAdminOnly } from "../middleware/authMiddleware.js";
import User from "../model/user.js";

const router = express.Router();

// 1️⃣ Get All Admins (Super Admin only)
router.get("/", protect, authorizeRoles("admin"), superAdminOnly, async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort({ lastLogin: -1 });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2️⃣ Create New Admin (Super Admin only)
router.post("/enroll", protect, authorizeRoles("admin"), superAdminOnly, async (req, res) => {
  try {
    const { name, email, password, contact, isSuperAdmin } = req.body;

    const admin = new User({
      name,
      email,
      password,
      contact,
      role: "admin",
      isSuperAdmin: isSuperAdmin || false,
      approvalStatus: "Approved"
    });

    await admin.save();
    res.status(201).json({ message: "Administrative account authorized", admin });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Administrative email already in use" });
    }
    res.status(500).json({ message: error.message });
  }
});

// 3️⃣ Toggle Super Admin Status
router.put("/toggle-super/:id", protect, authorizeRoles("admin"), superAdminOnly, async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin || admin.role !== "admin") return res.status(404).json({ message: "Admin not found" });

    // Governance Safeguard: Permanent Super Admin cannot be demoted
    if (admin.email === "admin@example.com") {
        return res.status(403).json({ message: "Institutional Error: Permanent Master Governance account status cannot be modified." });
    }

    // Prevent self-demotion if they are the only super admin (Safety check can be added)
    admin.isSuperAdmin = !admin.isSuperAdmin;
    await admin.save();

    res.status(200).json({ message: `Super Admin status ${admin.isSuperAdmin ? "granted" : "revoked"}`, admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4️⃣ Toggle Administrative Access (Active/Inactive)
router.put("/toggle-active/:id", protect, authorizeRoles("admin"), superAdminOnly, async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin || admin.role !== "admin") return res.status(404).json({ message: "Admin not found" });

    // Governance Safeguard: Cannot deauthorize the master account
    if (admin.email === "admin@example.com") {
        return res.status(403).json({ message: "Institutional Error: Permanent Master Governance access cannot be revoked." });
    }

    admin.isActive = !admin.isActive;
    await admin.save();

    res.status(200).json({ message: `Account ${admin.isActive ? "reactivated" : "deactivated"}`, admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
