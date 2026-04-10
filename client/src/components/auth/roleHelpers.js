import { useAuth } from "@/context/AuthContext";

export const useShowFor = () => {
  const { user } = useAuth();

  return {
    admin: user?.role === "admin",
    teacher: user?.role === "teacher",
    student: user?.role === "student",
    parent: user?.role === "parent",
    adminOnly: user?.role === "admin",
    teacherOrAdmin: ["admin", "teacher"].includes(user?.role),
    studentOrParent: ["student", "parent"].includes(user?.role),
  };
};
