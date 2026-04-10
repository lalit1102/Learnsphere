import Salary from "../model/salary.js";
import User from "../model/user.js";

// Utility: Simulate attendance (since Staff module is pending)
const simulateAttendance = () => {
    // Generates a mock attendance between 90% and 100%
    return Math.floor(Math.random() * (100 - 90 + 1)) + 90;
};

// Math Engine to compute Net Salary
const computeNetSalary = (base, allowance, deduction, attendance) => {
    const totalEarnings = base + allowance;
    // Basic logic: Deduct absence dynamically from total earnings.
    // e.g. 90% attendance means you receive 90% of (Base+Allowance) before fixed deductions.
    const attendanceAdjustedEarnings = totalEarnings * (attendance / 100);
    const net = attendanceAdjustedEarnings - deduction;
    return net > 0 ? net : 0;
};

/**
 * 1️⃣ Get Salaries by Month
 * Fetch or Initialize payroll configurations for a specific month
 */
export const getSalariesByMonth = async (req, res) => {
  try {
    const { monthYear } = req.query; // format "YYYY-MM"
    if (!monthYear) return res.status(400).json({ message: "monthYear parameter is definitively required" });

    // Ensure staff exist
    const staffMembers = await User.find({ role: { $in: ["admin", "teacher"] }, isActive: true });
    
    if (staffMembers.length === 0) {
        return res.status(200).json([]);
    }

    // Try finding records for this month
    let salaries = await Salary.find({ monthYear }).populate("staff", "name role email teacherDetails contact");

    // If records don't exist for some staff, initialize them dynamically
    const existingStaffIds = salaries.map(s => s.staff._id.toString());
    const newRecords = [];

    for (let staff of staffMembers) {
        if (!existingStaffIds.includes(staff._id.toString())) {
            // Typical Base Assumptions (for demonstration if zero)
            const defaultBase = staff.role === "admin" ? 5000 : 3500;
            const simAttendance = simulateAttendance();
            const net = computeNetSalary(defaultBase, 0, 0, simAttendance);

            newRecords.push({
                staff: staff._id,
                monthYear,
                baseSalary: defaultBase,
                allowances: 0,
                deductions: 0,
                attendancePercentage: simAttendance,
                netSalary: net,
                status: "Pending"
            });
        }
    }

    if (newRecords.length > 0) {
        await Salary.insertMany(newRecords);
        // Refresh fetch to get populated data
        salaries = await Salary.find({ monthYear }).populate("staff", "name role email teacherDetails contact");
    }

    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 2️⃣ Update Salary Config
 * Update base, allowance, and deductions before payment
 */
export const updateSalaryConfig = async (req, res) => {
    try {
        const { id } = req.params;
        const { baseSalary, allowances, deductions } = req.body;

        const salary = await Salary.findById(id);
        if (!salary) return res.status(404).json({ message: "Salary record not found" });

        if (salary.status === "Paid") {
            return res.status(400).json({ message: "Cannot modify finalized payroll records." });
        }

        salary.baseSalary = baseSalary ?? salary.baseSalary;
        salary.allowances = allowances ?? salary.allowances;
        salary.deductions = deductions ?? salary.deductions;
        salary.netSalary = computeNetSalary(salary.baseSalary, salary.allowances, salary.deductions, salary.attendancePercentage);

        await salary.save();
        
        // Re-fetch populated
        const updated = await Salary.findById(id).populate("staff", "name role email");
        res.status(200).json({ message: "Payroll constraints updated", salary: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 3️⃣ Mark As Paid
 */
export const markSalaryPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const salary = await Salary.findById(id).populate("staff", "name role email");

        if (!salary) return res.status(404).json({ message: "Salary record not found" });

        if (salary.status === "Paid") {
            return res.status(400).json({ message: "Record is already stamped as Paid." });
        }

        salary.status = "Paid";
        salary.paymentDate = new Date();
        await salary.save();

        res.status(200).json({ message: "Compensation transfer marked successfully.", salary });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
