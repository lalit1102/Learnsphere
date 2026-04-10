// DashboardStats.jsx
"use client";

import React from "react";
import {
  Users,
  BookOpen,
  Clock,
  GraduationCap,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * DashboardStats component that renders different metrics based on user role.
 * @param {Object} props
 * @param {string} props.role - One of 'admin', 'teacher', or 'student'.
 * @param {Object} props.data - The metrics data to display.
 */
export function DashboardStats({ role, data }) {
  const cardClasses =
    "group border-none shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900";

  // --- ADMIN VIEW ---
  if (role === "admin") {
    return (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Students */}
        <Card className={cardClasses}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Users className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-none font-bold">
                +12%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Total Students
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {data.totalStudents || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Total Teachers */}
        <Card className={cardClasses}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-2xl group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300">
                <GraduationCap className="h-6 w-6 text-violet-600 group-hover:text-white transition-colors" />
              </div>
              <Badge className="bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-none font-bold">
                Staff
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Total Teachers
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {data.totalTeachers || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Avg Attendance */}
        <Card className={cardClasses}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Clock className="h-6 w-6 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Avg Attendance
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {data.avgAttendance || "94.2%"}
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Active Exams */}
        <Card className={cardClasses}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                <BookOpen className="h-6 w-6 text-rose-600 group-hover:text-white transition-colors" />
              </div>
              <Badge className="bg-rose-100 text-rose-700 animate-pulse border-none font-bold">
                Live
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Active Exams
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {data.activeExams || 0}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- TEACHER VIEW ---
  if (role === "teacher") {
    return (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className={cardClasses}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Users className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                My Classes
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {data.myClassesCount || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className={cardClasses}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                <AlertCircle className="h-6 w-6 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 border-none font-bold">
                Action Needed
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Pending Grading
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {data.pendingGrading || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className={`${cardClasses} bg-indigo-600 text-white h-40`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest opacity-80">
                Timeline
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase tracking-wider opacity-80">
                Next Class
              </p>
              <h3 className="text-xl font-black leading-tight truncate">
                {data.nextClass || "Theoretical Physics"}
              </h3>
              <p className="text-sm font-medium opacity-90 flex items-center gap-1.5 pt-1">
                <CalendarDays className="size-3.5" />
                {data.nextClassTime || "Starts in 15m"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- STUDENT VIEW ---
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card className={`${cardClasses} min-h-[160px]`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              <Clock className="h-6 w-6 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Attendance
            </p>

            <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {data?.myAttendance ?? "98%"}
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Assignments */}
      <Card className={`${cardClasses} min-h-[160px]`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <BookOpen className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Assignments
            </p>

            <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {data?.pendingAssignments ?? 0}
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Today Classes */}
      <Card className={`${cardClasses} min-h-[160px]`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <CalendarDays className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Today Classes
            </p>

            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
              {data?.todayClasses?.length ? (
                data.todayClasses.slice(0, 2).map((c, i) => (
                  <p key={i} className="truncate">
                    {c.startTime} • {c.subject}
                  </p>
                ))
              ) : (
                <p>No classes</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Exam */}
      <Card
        className={`${cardClasses} min-h-[160px] bg-linear-to-br from-indigo-600 to-violet-700 text-white`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <CalendarDays className="h-6 w-6 text-white" />
            </div>
            <Badge className="bg-white/20 text-white border-none font-bold">
              Upcoming
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">
              Next Exam
            </p>

            <h3 className="text-xl font-black leading-tight truncate">
              {data?.nextExam ?? "No Exam"}
            </h3>

            <p className="text-sm font-medium opacity-90">
              {data?.nextExamDate ?? ""}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
