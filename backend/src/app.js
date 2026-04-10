import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import academicRoutes from "./routes/academicRoutes.js";
import attendanceRoutes from "./routes/attendanceRoute.js";
import assignmentRoutes from "./routes/assignmentRoute.js";
import submissionRoutes from "./routes/submissionRoute.js";
import dashboardRoutes from "./routes/dashboardRoute.js";
import academicYearRoutes from "./routes/academicYearRoute.js";
import activityRoutes from "./routes/activityRoute.js";
import classRoutes from "./routes/classRoute.js";
import subjectRoutes from "./routes/subjectRoute.js";
import timetableRoutes from "./routes/timetableRoute.js";
import reportRoutes from "./routes/reportRoute.js";
import studentRoutes from "./routes/studentRoute.js";
import teacherRoutes from "./routes/teacherRoute.js";
import parentRoutes from "./routes/parentRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import feeRoutes from "./routes/feeRoute.js";
import settingsRoutes from "./routes/settingsRoute.js";
import roleRoutes from "./routes/roleRoute.js";
import salaryRoutes from "./routes/salaryRoute.js";
import path from "path";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin:"http://localhost:5173", credentials:true }));

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "backend/uploads")));

app.use("/api/users", userRoutes);
app.use("/api", academicRoutes); // Mounts /api/subjects and /api/classes
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/academic-years", academicYearRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/salary", salaryRoutes);

app.get("/", (req,res)=>res.send("API running"));

export default app;