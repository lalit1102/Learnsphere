import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import PrivateRoutes from "@/pages/routes/PrivateRoutes";
import Dashboard from "@/pages/Dashboard";
import UserManagementPage from "@/pages/users/index";
import StudentManagement from "@/pages/users/StudentManagement";
import TeacherManagement from "@/pages/users/TeacherManagement";
import ParentManagement from "@/pages/users/ParentManagement";
import AdminManagement from "@/pages/users/AdminManagement";
import FeeManagement from "@/pages/finance/FeeManagement";
import ExpenseManagement from "@/pages/finance/ExpenseManagement";
import SalaryManagement from "@/pages/finance/SalaryManagement";
import ParentSearch from "@/pages/student/ParentSearch";
import MyStudents from "@/pages/teacher/MyStudents";
import MyLearning from "@/pages/student/MyLearning";
import Attendance from "@/pages/academics/Attendance";
import AttendanceReport from "@/pages/reports/AttendanceReport";
import AcademicReports from "@/pages/reports/AcademicReports";
import ActivitiesLog from "@/pages/admin/ActivitiesLog";
import ClassManagement from "@/pages/academics/ClassManagement";
import SubjectManagement from "@/pages/academics/SubjectManagement";
import TimetableManagement from "@/pages/academics/TimetableManagement";
import GeneralSettings from "@/pages/settings/GeneralSettings";
import AcademicYears from "@/pages/settings/AcademicYears";
import Roles from "@/pages/settings/Roles";

const router = createBrowserRouter([
  {
    children: [
      // Public routes
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },

      // Protected routes
      {
        element: <PrivateRoutes />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "admin/dashboard", element: <Dashboard /> },
          
          // Academic
          { path: "attendance", element: <Attendance /> },
          { path: "academics/classes", element: <ClassManagement /> },
          { path: "academics/subjects", element: <SubjectManagement /> },
          { path: "academics/timetable", element: <TimetableManagement /> },

          // Admn Specific
          { 
            path: "admin/teachers", 
            element: <UserManagementPage 
              role="teacher" 
              title="Teacher Directory" 
              description="Coordinate faculty accounts and subject assignments." 
            /> 
          },
          { 
            path: "admin/students", 
            element: <UserManagementPage 
              role="student" 
              title="Student Registry" 
              description="Enroll and manage student profiles and academic levels." 
            /> 
          },
          { path: "users/students", element: <StudentManagement /> },
          { path: "users/teachers", element: <TeacherManagement /> },
          { path: "users/parents", element: <ParentManagement /> },
          { path: "users/admins", element: <AdminManagement /> },
          { path: "settings/general", element: <GeneralSettings /> },
          { path: "settings/academic-years", element: <AcademicYears /> },
          { path: "settings/roles", element: <Roles /> },
          { path: "finance/fees", element: <FeeManagement /> },
          { path: "finance/expenses", element: <ExpenseManagement /> },
          { path: "finance/salary", element: <SalaryManagement /> },

          // Teacher Specific
          { path: "teacher/my-students", element: <MyStudents /> },

          // Student Specific
          { path: "student/my-learning", element: <MyLearning /> },

          // Reports
          { path: "reports/attendance", element: <AttendanceReport /> },
          { path: "reports/academic", element: <AcademicReports /> },

          // Activity Logs
          { path: "activities-log", element: <ActivitiesLog /> },

          // Parent Specific
          { path: "parent/search", element: <ParentSearch /> },
          
          // Redirect old/alias routes to clean structure
          { path: "management", element: <Navigate to="/admin/students" replace /> },
          // { path: "attendance", element: <Navigate to="/dashboard" replace /> }
        ],
      },

      // Fallback 404
      { path: "*", element: <div className="h-screen flex items-center justify-center font-bold text-2xl">404 - Registry Not Found</div> },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;