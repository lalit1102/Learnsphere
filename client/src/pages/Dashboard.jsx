import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  FileText,
  CheckCircle2
} from "lucide-react";

// UI Imports
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Custom Components & Logic
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "@/lib/api";
import { AiInsightWidget } from "@/components/dashboard/AiInsightWidget";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AdminAnalytics } from "@/components/dashboard/AdminAnalytics";
import { ProgressTracker } from "@/components/dashboard/ProgressTracker";

/**
 * Main Dashboard Page: Unified portal for all school roles.
 * Displays dynamic stats, AI insights, and quick management links.
 */
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({});

  /**
   * Fetch Dashboard Statistics on component mount.
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/dashboard/stats");
        setStatsData(data || {});
      } catch (error) {
        console.error("Failed to load school dashboard registry", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  // Loading Skeleton View
  if (loading) {
    return (
      <div className="p-8 lg:p-10 space-y-6 max-w-7xl mx-auto font-geist">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64 rounded-2xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-7">
          <Skeleton className="col-span-4 h-[400px] rounded-3xl" />
          <Skeleton className="col-span-3 h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-10 space-y-8 max-w-7xl mx-auto font-geist animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Academic Command Center</h2>
          <p className="text-muted-foreground text-base max-w-lg">
            Welcome back, <span className="text-indigo-600 font-bold">{user?.name}</span>. Here is your daily school performance overview.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Role specific dynamic actions */}
          {user?.role === "admin" && (
            <Button
              onClick={() => navigate("/users/students")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 dark:shadow-none"
            >
              Manage Student Registry
            </Button>
          )}
          {user?.role === "teacher" && (
            <Button
              onClick={() => navigate("/lms/quizzes")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 dark:shadow-none"
            >
              Architect New Exam
            </Button>
          )}
        </div>
      </div>

      {/* --- TOP ROW: STATS --- */}
      <DashboardStats role={user?.role || "student"} data={statsData} />

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* LEFT COLUMN: Insights & Activity */}
        <div className="lg:col-span-4 space-y-6">
          {user?.role === "admin" && <AdminAnalytics />}
          {user?.role === "student" && <ProgressTracker data={statsData} />}

          {/* AI ANALYTICS WIDGET */}
          <AiInsightWidget role={user?.role} />

          {/* SYSTEM ACTIVITY MONITOR */}
          {user?.role === "admin" && (
            <Card className="rounded-3xl border-none shadow-xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950">
              <CardHeader className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">System Pulse</CardTitle>
                    <CardDescription className="text-sm">Latest administrative synchronization logs.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  {statsData.recentActivity?.length > 0 ? (
                    statsData.recentActivity.map((activity, i) => (
                      <div
                        key={i}
                        className="flex items-start pb-4 last:mb-0 last:pb-0 border-b border-slate-100 dark:border-slate-800 last:border-0"
                      >
                        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {activity}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">Just now</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-slate-400 italic">No recent activities on the log.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN: Quick Access */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="rounded-3xl border-none shadow-xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 h-full">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold">Academic Accelerators</CardTitle>
              <CardDescription className="text-sm">Instant navigation to core sub-systems.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 grid gap-3">
              <Button
                variant="outline"
                className="justify-start h-14 rounded-2xl border-slate-100 dark:border-slate-800 hover:bg-slate-50 font-bold transition-all hover:translate-x-1"
                onClick={() => navigate("/academics/timetable")}
              >
                <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                </div>
                View School Schedule
              </Button>
              <Button
                variant="outline"
                className="justify-start h-14 rounded-2xl border-slate-100 dark:border-slate-800 hover:bg-slate-50 font-bold transition-all hover:translate-x-1"
                onClick={() => navigate("/lms/materials")}
              >
                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mr-3">
                  <FileText className="h-4 w-4 text-emerald-500" />
                </div>
                Access Learning Materials
              </Button>
              {user?.role === "admin" && (
                <Button
                  variant="outline"
                  className="justify-start h-14 rounded-2xl border-slate-100 dark:border-slate-800 hover:bg-slate-50 font-bold transition-all hover:translate-x-1"
                  onClick={() => navigate("/settings/academic-year")}
                >
                  <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-amber-500" />
                  </div>
                  System Global Config
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
