# LearnSphere — Project Implementation Plan

## 1. Project Overview
**LearnSphere** is a next-generation School Management System and Learning Management System (LMS) designed to unify the educational experience for Administrators, Teachers, Students, and Parents. The platform prioritizes high-end aesthetics, role-based security, and real-time academic tracking to foster a collaborative learning environment.

---

## 2. Current Progress (Completed)

We have successfully established the foundational architecture and critical business logic:

- **Unified Authentication**: Role-based access control (RBAC) with secure JWT persistence and Google OAuth support.
- **Universal User CRUD**: A dynamic form system (`UniversalUserForm`) that handles both registration and profile updates for all user roles.
- **Academic Infrastructure**: Full registry support for **Subjects** and **Classes**, including teacher-to-subject and student-to-class mappings.
- **Role-Aware Dashboards**:
  - **Admin**: Complete oversight of the institution, user management, and registry control.
  - **Teacher**: Personalized student rosters ("My Students") and attendance management.
  - **Student**: Personalized curriculum portal ("My Subjects") and teacher association directories.
- **Attendance System**: A robust, bulk-marking attendance module with historical tracking and visual analytics.
- **Parent Search Portal**: GR Number-based student discovery allowing parents to track registry details and academic placement.

---

## 3. Technical Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion (Animations) |
| **UI Components** | Shadcn UI, Lucide Icons, Sonner (Toast), Radix UI |
| **Form Handling** | React Hook Form, Zod (Validation) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT), Bcrypt.js |
| **API Client** | Axios with custom Interceptors |

---

## 4. Role-Based Feature Breakdown

### 🧑‍💼 Administrator
- Manage all users (Teachers, Students, Parents, Admins).
- Create and edit Classes and Subjects.
- Global registry search and pagination.
- System-wide attendance oversight.

### 🧑‍🏫 Teacher
- View assigned Class Roster ("My Students").
- Mark daily/subject-specific attendance for their assigned class.
- Manage Profile (Designation, Experience, Bio).
- View personal timetable and assigned subjects.

### 🧑‍🎓 Student
- Access personal curriculum ("My Subjects").
- View personal attendance history with visual trends.
- Browse directory of assigned teachers.
- View personal GR Number and registry metadata.

### 👪 Parent
- Track student profile via unique GR Number registry.
- View child's academic placement and assigned class info.

---

## 5. Database Schema Summary

### `User`
- **Core**: Name, Email, Password (hashed), Role, Profile Image.
- **Teacher**: Designation, Experience, Assigned Subjects (Refs).
- **Student**: GR Number, Parent Email, Assigned Class (Ref).

### `Class`
- **Fields**: Name, Academic Year (Ref), Class Teacher (Ref), Student List (Refs), Subject List (Refs).

### `Subject`
- **Fields**: Name, Registry Code, Teacher List (Refs), Active Status.

### `Attendance`
- **Fields**: Student (Ref), Class (Ref), Date, Status (Present/Absent/Late), Remarks, MarkedBy (Ref).

---

## 6. Future Roadmap

### 📊 Phase 1: Academic Reporting & AI Insights
- **Automated Report Cards**: Generate PDF reports based on attendance and exam performance.
- **AI Attendance Predictor**: Use historical data to notify parents of potential attendance concerns.

### 📝 Phase 2: Full LMS Integration (Assignments)
- **Submission Workflow**: Allow teachers to upload materials and students to submit assignments file-based.
- **Plagiarism Detection**: Integrate light-weight analysis for student submissions.

### 🔔 Phase 3: Notification & Communication Engine
- **In-App Alerts**: Real-time notifications for attendance marks and school announcements.
- **Email Bridge**: Automated emails to parents for absenteeism or upcoming exams.

### 📅 Phase 4: Advanced Exam Management
- **Gradebook**: A unified interface for managing marks and internal assessments.
- **Online Quizzes**: Time-bound MCQ and Short Answer tests inside the platform.
