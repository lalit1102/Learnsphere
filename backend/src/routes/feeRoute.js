import express from "express";
import { createFee, collectFee, getFeeSummary, getFees } from "../controllers/feeController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Financial Governance (Admin only)
router.get("/summary", protect, authorizeRoles("admin"), getFeeSummary);
router.get("/", protect, authorizeRoles("admin"), getFees);
router.post("/initialize", protect, authorizeRoles("admin"), createFee);
router.put("/collect/:id", protect, authorizeRoles("admin"), collectFee);

export default router;
