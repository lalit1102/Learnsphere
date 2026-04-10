import Fee from "../model/fee.js";
import Student from "../model/student.js";
import mongoose from "mongoose";

// 1️⃣ Create Fee Record (Admin only)
export const createFee = async (req, res) => {
  try {
    const { studentId, amount, dueDate, description } = req.body;

    const fee = new Fee({
      student: studentId,
      amount,
      dueDate,
      description
    });

    await fee.save();
    res.status(201).json({ message: "Fee record initialized", fee });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2️⃣ Record Payment (Admin only)
export const collectFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, receiptNumber } = req.body;

    const fee = await Fee.findById(id);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    fee.status = "Paid";
    fee.paymentDate = Date.now();
    fee.paymentMethod = paymentMethod;
    fee.receiptNumber = receiptNumber || `REC-${Date.now()}`;

    await fee.save();
    res.status(200).json({ message: "Fee collection finalized", fee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Get Financial Summary
export const getFeeSummary = async (req, res) => {
  try {
    const summary = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalCollected: {
            $sum: { $cond: [{ $eq: ["$status", "Paid"] }, "$amount", 0] }
          },
          totalPending: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, "$amount", 0] }
          },
          collectedCount: {
            $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] }
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json(summary[0] || { totalCollected: 0, totalPending: 0, collectedCount: 0, pendingCount: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4️⃣ Get All Fees
export const getFees = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate({
        path: "student",
        populate: { path: "user", select: "name email" }
      })
      .sort({ dueDate: 1 });
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
