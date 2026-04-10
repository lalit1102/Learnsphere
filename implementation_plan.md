# LearnSphere — Comprehensive Implementation Blueprint

## 1. Project Overview
LearnSphere is an integrated School Management System (SMS) and Learning Management System (LMS) designed for modern educational institutions. It provides a high-fidelity, role-based environment for Admins, Teachers, Students, and Parents to coordinate academic activities, track performance, and share learning materials.

---

## 2. Core Functional Modules (Implemented)

### 🔐 Authentication & Security
- **Role-Based Access Control (RBAC)**: Secure multi-role architecture (Admin, Teacher, Student, Parent).
- **JWT & Persistent Sessions**: Secure token-based authentication with cookie persistence.
- **Google OAuth Integration**: Seamless social login for students and faculty.
- **Role Helpers**: Client-side logic for conditional UI rendering and route protection.

### 👥 Global User Management
- **Universal CRUD Table**: Admin-level registry to search, filter (by role), and page through all institutional users.
- **Universal User Form**: A polymorphic form supporting **Create** and **Update** operations for all roles, with role-specific field injection (e.g., GR No, Teacher Subjects).

### 🏫 Academic Registry
- **Class & Subject Models**: Structured hierarchy linking students to classes and teachers to subjects.
- **Student Roster**: Specialized directory for teachers to monitor their assigned class group.
- **Teacher Directory**: A searchable list of educators mapped to specific student subjects.

### 📅 Attendance & Tracking
- **Bulk Marking Registry**: High-performance interface for teachers to mark daily or subject-wise attendance (Present, Absent, Late).
- **Persistence Layer**: Custom `Attendance` model with aggregation-ready indexing.
- **Student History**: Visual logs for students to track their own presence trends.

### 📖 LMS & Assignment Module
- **File-Based LMS**: Secure upload/download system for curriculum tasks (PDF, DOCX, etc.).
- **Teacher Portal**: Upload modal with class/subject targeting and deadline controls.
- **Student Portal**: Direct submission gateway for uploading completed work.
- **Infrastructure**: Configured Multer middleware and Express static serving for the `backend/uploads` directory.

### 📊 Reporting & Analytics
- **Admin Dashboard**: Visual pulse monitoring with 30-day attendance health and user distribution.
- **Analytics Engine**: 7-day Attendance Velocity charts powered by `recharts`.
- **Monthly Summary Reports**: Automated backend aggregation of class-wise attendance data.
- **PDF Export Engine**: Professional, branded PDF generation for institutional auditing using `jspdf`.
- **Student Progress Tracker**: Visual completion rings comparing submitted vs. total assigned tasks.

---

## 3. Technical Architecture

| Component | Technology | Rationale |
|---|---|---|
| **Frontend** | React (Vite) | High-speed HMR and optimized bundle size. |
| **Styling** | Tailwind CSS v4 & Shadcn UI | Premium, consistent design system with rich aesthetics. |
| **Backend** | Node.js & Express | Scalable, non-blocking asynchronous architecture. |
| **Database** | MongoDB & Mongoose | Schema-flexibility for evolving academic data (e.g., AI Insights). |
| **Storage** | Local FS (Multer) | Integrated local handling for assignments and submissions. |
| **Analytics** | Recharts | SVG-based, responsive data visualizations. |
| **Reporting** | jsPDF + html2canvas | Client-side, high-fidelity PDF generation. |

---

## 4. Verified Database Schema

### `User`
Tracks identity, role, and role-specific details (Registry ID, Faculty Designation).
### `Class` & `Subject`
Defines the institutional structure and the teacher-student assignment loop.
### `Attendance`
Stores point-in-time presence data for reporting and predictive analytics.
### `Assignment` & `Submission`
The main data pipeline for the file-based Learning Management System.

---

## 5. Future Growth Roadmap

### 📡 Phase 3: Notification & Communication Engine
- **In-App Alerts**: Bell notifications for new assignments, attendance pings, and grades.
- **Parent SMS/Email Bridge**: High-priority alerts for student absenteeism.

### 🍎 Phase 4: Assessment & Grading System
- **Advanced Gradebook**: Centralized UI for teachers to review submissions and input grades/feedback.
- **Digital Exams**: Time-bound, browser-locked MCQ and short-answer test modules.

### 🤖 Phase 5: AI-Powered Academic Insights
- **Student Risk Detection**: Analysis of attendance and submission gaps to flag at-risk students.
- **Automated Tutoring**: Generative AI suggestions for students based on assignment performance.
