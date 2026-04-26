import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  UserCheck,
  LayoutGrid,
  Loader2
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { format, isWithinInterval, parse } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timetable, setTimetable] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Today's Day Name (Monday, Tuesday...)
  const today = format(currentTime, "EEEE");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [timetableRes, classesRes] = await Promise.all([
          api.get(`/timetable/teacher/${user._id}`),
          api.get("/classes") 
        ]);

        setTimetable(timetableRes.data || []);
        
        // Filter classes where teacher is the mentor or teacher
        const fetchedClasses = classesRes.data?.classes || classesRes.data || [];
        const teacherClasses = fetchedClasses.filter(
          c => c.classTeacher?._id === user._id || c.mentorId === user._id || c.classTeacher === user._id
        );
        setClasses(teacherClasses);

      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        toast.error("Failed to synchronize dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchDashboardData();

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [user]);

  // Logic to find Ongoing and Next Lecture
  const { currentLecture, nextLecture } = useMemo(() => {
    const todaySlots = timetable.filter(s => s.day === today).sort((a, b) => a.startTime.localeCompare(b.startTime));
    const nowStr = format(currentTime, "HH:mm");

    const ongoing = todaySlots.find(s => {
      // Direct string comparison works for HH:mm format
      return s.startTime <= nowStr && s.endTime > nowStr;
    });

    const next = todaySlots.find(s => s.startTime > nowStr);

    return { currentLecture: ongoing, nextLecture: next };
  }, [timetable, today, currentTime]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-[1600px] mx-auto font-geist animate-in fade-in duration-1000">
      {/* Header & Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
            Welcome back, <span className="text-indigo-600 italic">Prof. {user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-indigo-500" />
            {format(currentTime, "PPPP")} | <Clock className="w-4 h-4 text-indigo-500 ml-2" /> {format(currentTime, "HH:mm")}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-2 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
          <Badge variant="secondary" className="rounded-xl px-4 py-1.5 bg-indigo-50 text-indigo-700 border-indigo-100 font-bold uppercase tracking-widest text-[10px]">
            Academic Status: Active
          </Badge>
        </div>
      </div>

      {/* 1) Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 dark:shadow-none bg-gradient-to-br from-indigo-600 to-blue-700 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Users className="w-32 h-32" />
          </div>
          <CardContent className="p-8 space-y-4">
            <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100 opacity-80">Mentor Status</p>
              <h3 className="text-3xl font-black leading-none mt-1">{classes.length} Classes</h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-100 bg-white/10 w-fit px-3 py-1 rounded-full">
              <UserCheck className="w-3 h-3" /> Assigned as Mentor
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 relative overflow-hidden group">
           <CardContent className="p-8 space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 w-10 h-10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Attendance Matrix</p>
              <h3 className="text-3xl font-black leading-none mt-1 text-slate-900 dark:text-white">94.2%</h3>
            </div>
            <div className="space-y-1.5 pt-2">
              <Progress value={94.2} className="h-1.5 bg-emerald-100 dark:bg-emerald-500/5" indicatorClassName="bg-emerald-500" />
              <p className="text-[10px] font-bold text-emerald-600 uppercase">Avg Daily Engagement</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 relative overflow-hidden group">
           <CardContent className="p-8 space-y-4">
            <div className="bg-rose-50 dark:bg-rose-500/10 w-10 h-10 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upcoming Exam</p>
              <h3 className="text-xl font-black leading-tight mt-1 text-slate-900 dark:text-white truncate max-w-full">
                Mathematics Mid-Term
              </h3>
            </div>
            <Button variant="link" className="p-0 h-auto text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center">
              View Calendar <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 2) Next Up & Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Time Matrix & Schedule */}
        <div className="lg:col-span-8 space-y-8">
          {/* Quick Action: Current/Next Lecture */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-15 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
            <Card className="relative rounded-[2.5rem] border-none bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
               <div className="flex flex-col md:flex-row items-center">
                  <div className="p-8 md:p-10 flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                       <Badge className={cn(
                         "font-black uppercase tracking-widest text-[9px] px-3",
                         currentLecture ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white"
                       )}>
                         {currentLecture ? "Ongoing Now" : (nextLecture ? "Coming Up Next" : "Day Completed")}
                       </Badge>
                       <span className="text-xs font-bold text-slate-400">
                         {currentLecture 
                            ? `${currentLecture.startTime} - ${currentLecture.endTime}` 
                            : (nextLecture ? `Starts at ${nextLecture.startTime}` : "No more classes")}
                       </span>
                    </div>
                    
                    {currentLecture ? (
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white italic">
                          {currentLecture.subject?.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 text-slate-500">
                           <p className="font-medium flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-500" />
                            Cohort: {currentLecture.class?.name}
                           </p>
                            <p className="font-medium flex items-center gap-2 border-l pl-4 border-slate-200">
                             <LayoutGrid className="w-5 h-5 text-indigo-500" />
                             Room: {currentLecture.roomNumber || "Wing A"}
                           </p>
                        </div>
                      </div>
                    ) : nextLecture ? (
                      <div className="space-y-2">
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Active Session</p>
                        <h2 className="text-3xl font-black tracking-tight text-slate-900/50 dark:text-white/50 italic">
                          Next Class: {nextLecture.subject?.name}
                        </h2>
                      </div>
                    ) : (
                      <h2 className="text-3xl font-black tracking-tight text-slate-400 italic">Institutional Schedule Complete</h2>
                    )}

                    <div className="flex items-center gap-4 pt-2">
                      <Button 
                        disabled={!currentLecture}
                        onClick={() => navigate("/attendance")}
                        className="rounded-2xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-40"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Attendance
                      </Button>
                      <Button variant="ghost" className="rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:bg-slate-50">
                        Lesson Plan
                      </Button>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex w-72 bg-slate-50 dark:bg-white/5 p-10 flex-col items-center justify-center border-l border-slate-100 dark:border-white/5 gap-4">
                     <div className={cn(
                       "h-20 w-20 rounded-full flex items-center justify-center relative",
                       currentLecture ? "bg-emerald-100 dark:bg-emerald-500/10" : "bg-slate-100 dark:bg-white/5"
                     )}>
                        {currentLecture && <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>}
                        <Clock className={cn("w-8 h-8", currentLecture ? "text-emerald-600" : "text-slate-400")} />
                     </div>
                     <div className="text-center">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Temporal Status</p>
                        <p className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter">
                          {currentLecture ? "Session Live" : (nextLecture ? "Waiting..." : "Dismissed")}
                        </p>
                     </div>
                  </div>
               </div>
            </Card>
          </div>

          {/* Detailed Schedule Matrix */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight italic uppercase text-slate-900 dark:text-white">Daily Schedule Registry</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active for {today}</p>
              </div>
              <Button variant="ghost" size="sm" className="font-bold text-xs text-indigo-600 hover:bg-indigo-50 rounded-xl">Weekly View</Button>
            </div>
            
            <div className="space-y-4">
              {timetable.filter(s => s.day === today).length > 0 ? (
                timetable.filter(s => s.day === today).map((slot, idx) => {
                  const isCurrent = slot._id === currentLecture?._id;
                  return (
                    <Card 
                      key={slot._id} 
                      id={isCurrent ? "current-lecture-slot" : undefined}
                      className={cn(
                        "rounded-[2rem] border shadow-sm transition-all duration-700",
                        isCurrent 
                          ? "ring-4 ring-indigo-600 ring-offset-4 dark:ring-offset-slate-950 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-2xl shadow-indigo-100 dark:shadow-none animate-pulse-subtle scale-[1.02]" 
                          : "border-slate-100 dark:border-white/5 hover:border-indigo-100 hover:bg-slate-50/50"
                      )}
                    >
                      <CardContent className="p-6 flex flex-row items-center gap-6">
                        <div className={cn(
                          "w-20 h-20 rounded-3xl flex flex-col items-center justify-center gap-1 shrink-0 transition-colors",
                          isCurrent ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-50 dark:bg-white/5 text-slate-400"
                        )}>
                          <span className="text-sm font-black tracking-tighter">{slot.startTime}</span>
                          <div className={cn("h-px w-8", isCurrent ? "bg-white/20" : "bg-slate-200 dark:bg-white/10")} />
                          <span className="text-[10px] font-bold opacity-60 uppercase">{slot.endTime}</span>
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                             <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none italic">{slot.subject?.name}</h4>
                             {isCurrent && <Badge className="bg-indigo-600/10 text-indigo-600 text-[8px] h-4 font-black border-none animate-pulse">LIVE</Badge>}
                          </div>
                          <p className="text-sm font-medium text-slate-400 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                            <LayoutGrid className="w-3 h-3 text-indigo-500" /> {slot.class?.name} • <MapPin className="w-3 h-3 text-indigo-400" /> {slot.roomNumber || "Wing A"}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                           <Badge variant="outline" className={cn(
                             "rounded-lg font-black uppercase tracking-tighter text-[9px] px-3 h-7",
                             slot.type === "Break" ? "bg-slate-900 text-white" : "bg-white dark:bg-transparent"
                           )}>
                             {slot.type}
                           </Badge>
                           <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-white shadow-sm border border-slate-100">
                             <MoreVertical className="w-4 h-4 text-slate-400" />
                           </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="p-20 text-center space-y-4 border-2 border-dashed border-slate-100 rounded-[3rem]">
                   <Calendar className="h-12 w-12 mx-auto text-slate-200" />
                   <p className="text-slate-400 font-bold italic uppercase tracking-widest text-sm">No Academic Sessions for Today</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Insights & Upcoming */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="rounded-[3rem] border-none bg-white dark:bg-slate-900 shadow-2xl overflow-hidden p-8 space-y-8">
             <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight italic uppercase text-slate-900 dark:text-white">Academic Calendar</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upcoming Institutional Events</p>
             </div>
             
             <div className="space-y-6">
                {[
                  { title: "Parent Teacher Meeting", date: "April 28, 2026", type: "General" },
                  { title: "Mid-Term Examination", date: "May 02, 2026", type: "Exam" },
                  { title: "Sports Annual Week", date: "May 15, 2026", type: "Event" },
                ].map((ev, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                     <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex flex-col items-center justify-center shrink-0 border border-slate-100 dark:border-white/5 group-hover:bg-indigo-50 transition-colors">
                        <span className="text-[10px] font-black text-indigo-600 leading-none">{ev.date.split(' ')[1].replace(',', '')}</span>
                        <span className="text-[8px] font-black uppercase text-slate-400">{ev.date.split(' ')[0]}</span>
                     </div>
                     <div className="flex-1 space-y-0.5">
                        <h5 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{ev.title}</h5>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{ev.type} • Tomorrow</p>
                     </div>
                     <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-500 transition-colors self-center" />
                  </div>
                ))}
             </div>

             <Button variant="outline" className="w-full h-12 rounded-2xl border-indigo-100 text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50">
               Sync Institutional Calendar
             </Button>
          </Card>

          <Card className="rounded-[3rem] border-none bg-indigo-600 p-8 space-y-6 relative overflow-hidden text-white">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users className="w-24 h-24" />
             </div>
             <div className="relative z-10 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Mentor Hub</h3>
                  <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest opacity-80">Grade 10-A Management</p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-100">
                    <span>Syllabus Completion</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-1 bg-white/10" indicatorClassName="bg-white" />
                </div>
                <Button variant="outline" className="w-full h-10 rounded-xl bg-white text-indigo-600 font-black uppercase tracking-widest text-[9px] hover:bg-indigo-50 border-none">
                  Open Mentor Console
                </Button>
             </div>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.98; transform: scale(1.005); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;
