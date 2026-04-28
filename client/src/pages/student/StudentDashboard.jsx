import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Fingerprint, CalendarDays, BookOpen, User, Hash, Mail, Users } from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, total: 0, percentage: 0 });
  const [syllabusStats, setSyllabusStats] = useState({ completed: 0, total: 0, percentage: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Student Profile by User ID
        const studentRes = await api.get(`/students/user/${user._id}`);
        const student = studentRes.data.student;
        setStudentData(student);

        if (student) {
          // 2. Fetch Attendance
          const attendanceRes = await api.get(`/attendance/student/${student._id}`);
          const records = attendanceRes.data || [];
          const presentCount = records.filter(r => r.status === "Present").length;
          const totalDays = records.length;
          const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;
          
          setAttendanceStats({ present: presentCount, total: totalDays, percentage });

          // 3. Fetch Syllabus Progress
          const syllabusRes = await api.get("/syllabus");
          const modules = syllabusRes.data || [];
          const completedModules = modules.filter(m => m.status === true).length;
          const totalModules = modules.length;
          const syllabusPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

          setSyllabusStats({ completed: completedModules, total: totalModules, percentage: syllabusPercentage });
        }

      } catch (error) {
        console.error("Dashboard Error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="font-bold text-slate-600 italic">Loading your workspace...</p>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
        <p className="text-xl font-black text-slate-600">Student profile not found.</p>
      </div>
    );
  }

  const currentDate = format(new Date(), "EEEE, MMMM do yyyy");
  const className = studentData.user?.studentClass?.name || "Unassigned";
  const rollNumber = studentData.rollNo ? String(studentData.rollNo).padStart(2, '0') : '--';

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-geist animate-in fade-in duration-700">
      <div className="max-w-[1200px] mx-auto space-y-10">
        
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-800">
            Welcome back, <span className="text-indigo-600">{studentData.user?.name}</span>!
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-600 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-indigo-600" /> {currentDate}</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-indigo-600" /> Class: {className}</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5"><Hash className="h-4 w-4 text-indigo-600" /> Roll No: {rollNumber}</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Attendance Card */}
          <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase text-slate-600 tracking-widest">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <span className="text-5xl font-black text-emerald-600">{attendanceStats.percentage}%</span>
                  <p className="text-xs font-bold text-slate-600 italic">Present {attendanceStats.present} out of {attendanceStats.total} days</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CalendarDays className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Progress Card */}
          <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase text-slate-600 tracking-widest">Syllabus Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-indigo-600">{syllabusStats.percentage}%</span>
                  <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <Progress value={syllabusStats.percentage} className="h-2 bg-indigo-100" />
                <p className="text-xs font-bold text-slate-600 italic">{syllabusStats.completed} of {syllabusStats.total} modules completed</p>
              </div>
            </CardContent>
          </Card>

          {/* GR Number Card */}
          <Card className="rounded-2xl shadow-sm bg-gradient-to-br from-indigo-600 to-violet-600 relative overflow-hidden text-white border-none">
            {/* Override global border-t since it's a solid colored card */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-sm font-black uppercase text-indigo-200 tracking-widest">Institutional ID</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center gap-4 mt-2">
                <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Fingerprint className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black tracking-tight">{studentData.grNumber}</span>
                  <span className="text-xs font-bold text-indigo-200 italic uppercase">Global Registration No.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Section */}
        <div className="pt-4">
          <h3 className="text-xl font-black tracking-tight text-slate-800 mb-4">Profile Metadata</h3>
          <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white p-2">
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Guardian Name</p>
                  <p className="text-lg font-bold text-indigo-600">{studentData.parentName || "Not Provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Hash className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Roll Number</p>
                  <p className="text-lg font-bold text-slate-700">{rollNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Academic Email</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{studentData.user?.email}</p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
