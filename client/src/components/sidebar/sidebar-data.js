import {
  Settings2,
  School,
  GraduationCap,
  Users,
  LayoutDashboard,
  Banknote,
  FileText,
} from "lucide-react";

// Sidebar Data
export const sidebardata = {
  teams: [
    {
      name: "Springfield High",
      logo: School,
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "teacher", "student", "parent"],
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          roles: ["admin", "teacher", "student", "parent"],
        },
      ],
    },
    {
      title: "Academics",
      url: "#",
      icon: School,
      roles: ["admin", "teacher", "student", "parent"],
      items: [
        { title: "My Subjects", url: "/student/my-learning", roles: ["student"] },
        { title: "Grades", url: "/student/grades", roles: ["student"] },
        { title: "Classes", url: "/academics/classes", roles: ["admin", "teacher"] },
        { title: "Subjects", url: "/academics/subjects", roles: ["admin", "teacher"] },
        { title: "Timetable", url: "/academics/timetable", roles: ["admin", "teacher", "student", "parent"] },
        { title: "Attendance", url: "/attendance", roles: ["admin", "teacher", "student"] },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: FileText,
      roles: ["admin", "teacher"],
      items: [
        { title: "Attendance Report", url: "/reports/attendance", roles: ["admin", "teacher"] },
        { title: "Activity Reports", url: "/reports/activity", roles: ["admin"] },
        { title: "Academic Summary", url: "/reports/academic", roles: ["admin"] },
      ],
    },
    {
      title: "Learning (LMS)",
      url: "#",
      icon: GraduationCap,
      roles: ["admin", "teacher", "student"],
      items: [
        { title: "Assignments", url: "/lms/assignments", roles: ["admin", "teacher", "student"] },
        { title: "Exams", url: "/lms/exams", roles: ["admin", "teacher", "student"] },
        { title: "Study Materials", url: "/lms/materials", roles: ["admin", "teacher", "student"] },
      ],
    },
    {
      title: "People",
      url: "#",
      icon: Users,
      roles: ["admin", "teacher"],
      items: [
        { title: "My Students", url: "/teacher/my-students", roles: ["teacher"] },
        { title: "Students", url: "/users/students", roles: ["admin"] },
        { title: "Teachers", url: "/users/teachers", roles: ["admin"] },
        { title: "Parents", url: "/users/parents", roles: ["admin"] },
        { title: "Admins", url: "/users/admins", roles: ["admin"] },
      ],
    },
    {
      title: "Finance",
      url: "#",
      icon: Banknote,
      roles: ["admin"],
      items: [
        { title: "Fee Collection", url: "/finance/fees", roles: ["admin"] },
        { title: "Expenses", url: "/finance/expenses", roles: ["admin"] },
        { title: "Salary", url: "/finance/salary", roles: ["admin"] },
      ],
    },
    {
      title: "System",
      url: "#",
      icon: Settings2,
      roles: ["admin"],
      items: [
        { title: "School Settings", url: "/settings/general", roles: ["admin"] },
        { title: "Academic Years", url: "/settings/academic-years", roles: ["admin"] },
        { title: "Roles & Permissions", url: "/settings/roles", roles: ["admin"] },
        { title: "Audit Logs", url: "/activities-log", roles: ["admin"] },
      ],
    },
  ],
};

