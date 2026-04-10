import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/status", protect, (req, res) => res.json({ status: "Academic routes active" }));

export default router;
