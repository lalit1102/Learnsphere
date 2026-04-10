import Role from "../model/role.js";

const DEFAULT_ROLES = [
  {
    name: "admin",
    displayName: "Administrator",
    description: "Core administrative staff with access to institutional governance.",
    permissions: ["manage_users", "manage_academics", "manage_finance", "view_reports", "manage_settings"]
  },
  {
    name: "teacher",
    displayName: "Faculty / Teacher",
    description: "Educational staff responsible for instructional delivery and student evaluation.",
    permissions: ["view_classes", "manage_attendance", "submit_grades"]
  },
  {
    name: "student",
    displayName: "Student",
    description: "Enrolled learners accessing curriculum and evaluation data.",
    permissions: ["view_learning_materials", "submit_assignments", "view_grades"]
  },
  {
    name: "parent",
    displayName: "Parent / Guardian",
    description: "Guardians of enrolled learners, monitoring academic progress and fee obligations.",
    permissions: ["view_child_reports", "view_fees"]
  }
];

// 1️⃣ Initialize Default Roles (Auto-run on fetch if empty)
export const initializeRoles = async () => {
  try {
    const existingCount = await Role.countDocuments();
    if (existingCount === 0) {
      await Role.insertMany(DEFAULT_ROLES);
      console.log("System Default Roles initialized.");
    }
  } catch (error) {
    console.error("Failed to initialize default roles", error);
  }
};

// 2️⃣ Get All Roles
export const getAllRoles = async (req, res) => {
  try {
    await initializeRoles(); // Ensure roles exist
    const roles = await Role.find().sort({ createdAt: 1 });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Update Role Permissions (Super Admin only)
export const updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Role definition not found." });
    }

    if (role.name === "admin" && role.isSystemFixed) {
       // Optional: You might prevent removing critical permissions from admin, but since it's Super Admin, we allow it with a warning.
       // We'll allow replacing the array for now.
    }

    role.permissions = permissions || [];
    await role.save();

    res.status(200).json({ message: "Role permissions synchronized", role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
