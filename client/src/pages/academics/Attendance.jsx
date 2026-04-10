import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Save,
  Loader2,
  CalendarDays,
  UserCheck,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

// Custom Logic
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AiInsightWidget } from "@/components/dashboard/AiInsightWidget";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import CustomPagination from "@/components/global/CustomPagination";

// ==========================================
// 1) PROXY COMPONENT 
// ==========================================
export default function Attendance() {
  const { user } = useAuth();
  
  if (user?.role === "student") {
    return <StudentAttendanceView user={user} />;
  }
  
  return <TeacherAdminAttendanceView user={user} />;
}


// ==========================================
// 2) STUDENT: PERSONAL ATTENDANCE VIEW
// ==========================================
function StudentAttendanceView({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Context state
  const [calendarDate, setCalendarDate] = useState(undefined); // Selected day
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Viewing month
  const [subjectFilter, setSubjectFilter] = useState("all");
  
  // Pagination for Student
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/attendance/student/${user._id}`);
        setHistory(data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load attendance history");
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchHistory();
  }, [user]);

  // Subjects for filtering
  const studentSubjects = useMemo(() => {
    const subs = new Set();
    history.forEach(h => {
      if (h.subject?.name) subs.add(h.subject.name);
    });
    return Array.from(subs);
  }, [history]);

  // Stats filtered by the SELECTED MONTH (e.g. "April 2026")
  const monthStats = useMemo(() => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    
    const recordsInMonth = history.filter(r => {
      const d = new Date(r.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const total = recordsInMonth.length;
    const present = recordsInMonth.filter(r => r.status === 'present' || r.status === 'late').length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, rate };
  }, [history, currentMonth]);

  // Final filtered list for the table
  const filteredHistory = useMemo(() => {
    let result = [...history];

    if (calendarDate) {
      const target = format(calendarDate, "yyyy-MM-dd");
      result = result.filter(r => format(new Date(r.date), "yyyy-MM-dd") === target);
    }

    if (subjectFilter !== "all") {
      result = result.filter(r => r.subject?.name === subjectFilter);
    }

    return result;
  }, [history, calendarDate, subjectFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / recordsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Calendar Modifiers with Glows
  const modifiers = {
    present: history.filter(h => h.status === 'present' || h.status === 'late').map(h => new Date(h.date)),
    absent: history.filter(h => h.status === 'absent').map(h => new Date(h.date))
  };

  const modifiersClassNames = {
    present: "status-present",
    absent: "status-absent"
  };

  return (
    <div className="p-8 lg:p-12 space-y-10 max-w-7xl mx-auto font-geist animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Polished Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-white/5 pb-8">
        <div className="space-y-2">
          <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50/50 mb-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-center w-full">
            Student Portal
          </Badge>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
            My Attendance <span className="text-indigo-600">—</span> {format(currentMonth, "MMMM yyyy")}
          </h2>
          <p className="text-muted-foreground text-sm max-w-md">
            Interactive insight into your academic punctuality and presence across all modules.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-slate-50/50 dark:bg-white/5 p-2 rounded-2xl border border-slate-100 dark:border-white/5">
          <Select value={subjectFilter} onValueChange={(val) => { setSubjectFilter(val); setCurrentPage(1); }}>
            <SelectTrigger className="w-[200px] h-10 rounded-xl border-none bg-white dark:bg-slate-900 shadow-sm font-medium text-xs">
              <Filter className="w-3.5 h-3.5 mr-2 text-indigo-500" />
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
              <SelectItem value="all" className="text-xs">All My Subjects</SelectItem>
              {studentSubjects.map(sub => (
                <SelectItem key={sub} value={sub} className="text-xs">{sub}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {calendarDate && (
            <Button 
              variant="outline" 
              onClick={() => setCalendarDate(undefined)}
              className="text-[10px] h-10 px-4 rounded-xl font-bold text-rose-500 border-rose-100 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95"
            >
              Reset Date Filter
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Aspect: Sidebar Controls & Stats */}
        <div className="lg:col-span-4 space-y-8">
          {/* Centered Calendar Card */}
          <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden group">
            <div className="bg-slate-50 dark:bg-white/5 p-2 flex justify-center border-b border-slate-100 dark:border-white/5">
               <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase">Calendar Insights</span>
            </div>
            <div className="p-6 flex justify-center">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={setCalendarDate}
                onMonthChange={setCurrentMonth}
                month={currentMonth}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                className="rounded-3xl border-none pointer-events-auto"
              />
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
             <Card className="student-card-glow rounded-[32px] p-6 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 text-white relative overflow-hidden group transition-all hover:scale-[1.02]">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                  <CalendarDays className="w-20 h-20" />
                </div>
                <div className="relative z-10 space-y-4">
                  <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest opacity-80">Monthly Avg</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">{monthStats.total}</span>
                    <span className="text-xs font-medium opacity-60">sessions</span>
                  </div>
                </div>
             </Card>
             
             <Card className="student-card-glow rounded-[32px] p-6 bg-gradient-to-br from-indigo-500 to-teal-500 text-white relative overflow-hidden group transition-all hover:scale-[1.02]">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                   <Clock className="w-20 h-20" />
                </div>
                <div className="relative z-10 space-y-4">
                  <p className="text-[10px] font-black text-teal-500 bg-white/10 w-fit px-2 py-0.5 rounded-full uppercase tracking-widest">Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">{monthStats.rate}%</span>
                  </div>
                </div>
             </Card>
          </div>
        </div>

        {/* Right Aspect: Detailed Table */}
        <div className="lg:col-span-8 space-y-8 text-center sm:text-left">
          <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Attendance Log</CardTitle>
                <CardDescription className="text-xs font-medium text-slate-400 mt-1">
                  {calendarDate 
                    ? `Showing logs for ${format(calendarDate, "PPP")}`
                    : "Comprehensive session breakdown"}
                </CardDescription>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 dark:bg-white/5">
                <Users className="w-5 h-5 text-indigo-500" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                 <div className="p-10 space-y-6">
                   {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 w-full rounded-2xl" />)}
                 </div>
              ) : paginatedHistory.length > 0 ? (
                 <div className="overflow-x-auto min-h-[400px]">
                   <Table>
                     <TableHeader className="bg-slate-50/50 dark:bg-white/5">
                        <TableRow className="hover:bg-transparent border-none">
                          <TableHead className="w-[140px] font-black text-[10px] uppercase tracking-widest text-slate-400 pl-8">Date</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Subject</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Teacher</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 text-center">Status</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 pr-8 min-w-[200px]">Remarks</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                       {paginatedHistory.map((record) => (
                         <TableRow key={record._id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 group border-b border-slate-50 dark:border-white/5 transition-colors">
                           <TableCell className="pl-8 py-5">
                             <div className="flex flex-col">
                               <span className="text-sm font-bold text-slate-800 dark:text-white">{format(new Date(record.date), "MMM dd, yyyy")}</span>
                               <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{format(new Date(record.date), "EEEE")}</span>
                             </div>
                           </TableCell>
                           <TableCell>
                             <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black w-fit rounded-lg ring-1 ring-indigo-200 dark:ring-indigo-500/20">
                               {record.subject?.name || "General"}
                             </div>
                           </TableCell>
                           <TableCell className="text-sm font-medium text-slate-600 dark:text-slate-400">
                             {record.markedBy?.name || "System"}
                           </TableCell>
                           <TableCell className="text-center">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-white/5 ring-1 ring-slate-200 dark:ring-white/10 group-hover:scale-105 transition-transform">
                                {record.status === 'present' && <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />}
                                {record.status === 'absent' && <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />}
                                {record.status === 'late' && <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />}
                                <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300">{record.status}</span>
                              </div>
                           </TableCell>
                           <TableCell className="pr-8 text-right sm:text-left">
                             <span className={cn(
                               "text-xs leading-relaxed",
                               (record.attendance_remarks || record.remarks) ? "text-slate-500 dark:text-slate-400 truncate max-w-[150px] inline-block" : "remark-muted text-center sm:text-left"
                             )}>
                               {record.attendance_remarks || record.remarks || "-"}
                             </span>
                           </TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                   </Table>
                   
                   <div className="mt-auto border-t border-slate-50 dark:border-white/5 bg-slate-50/30 dark:bg-black/10">
                    <CustomPagination 
                        loading={loading}
                        page={currentPage}
                        setPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                   </div>
                 </div>
              ) : (
                <div className="p-24 text-center space-y-6">
                  <div className="h-24 w-24 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto ring-[10px] ring-slate-100 dark:ring-white/5">
                    <Search className="h-12 w-12 text-indigo-500 opacity-50" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Focus on Search</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-2 leading-relaxed">No logs detected for your criteria. Reset filters to explore your history.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => { setSubjectFilter("all"); setCalendarDate(undefined); }} 
                    className="rounded-2xl mt-4 border-indigo-100 hover:bg-indigo-50 font-bold transition-all px-8"
                  >
                    Clear Filter Stack
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 3) TEACHER / ADMIN VIEW (Original Logic)
// ==========================================
function TeacherAdminAttendanceView({ user }) {
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // studentId -> status
  const [remarks, setRemarks] = useState({}); // studentId -> remark
  
  const [selectedYearId, setSelectedYearId] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, total: 0 });

  // Fetch classes and subjects on mount
  useEffect(() => {
    const fetchDataInitial = async () => {
      try {
        const [classRes, subjectRes] = await Promise.all([
          api.get("/classes"),
          api.get("/subjects")
        ]);
        
        const fetchedClasses = classRes.data.classes || [];
        setClasses(fetchedClasses);
        setSubjects(subjectRes.data.subjects || subjectRes.data || []);
        
        // Extract unique academic years
        const uniqueYearsMap = new Map();
        fetchedClasses.forEach(c => {
          if (c.academicYear && c.academicYear._id) {
            uniqueYearsMap.set(c.academicYear._id, c.academicYear);
          }
        });
        const yearsArray = Array.from(uniqueYearsMap.values());
        setAcademicYears(yearsArray);
        
        if (yearsArray.length > 0) {
          setSelectedYearId(yearsArray[0]._id);
        }
      } catch (err) {
        console.error("Fetch initial error:", err);
        toast.error("Failed to load initial data");
      }
    };
    fetchDataInitial();
  }, []);

  // Update selected class when academic year or classes change
  useEffect(() => {
    if (!selectedYearId || classes.length === 0) return;
    let filtered = classes.filter(c => c.academicYear?._id === selectedYearId);
    
    // Teacher-Class Restriction: If teacher, only show their classes
    if (user?.role === "teacher") {
      filtered = filtered.filter(c => c.classTeacher?._id === user?._id);
    }
    
    if (filtered.length > 0) {
      if (!filtered.find(c => c._id === selectedClass)) {
        setSelectedClass(filtered[0]._id);
      }
    } else {
      setSelectedClass("");
    }
  }, [selectedYearId, classes, selectedClass, user]);

  // Derived state for the currently selected class object
  const selectedClassObj = useMemo(() => {
    return classes.find(c => c._id === selectedClass);
  }, [classes, selectedClass]);

  // Fetch students and their attendance for selected class/date
  const fetchData = useCallback(async () => {
    if (!selectedClass || !selectedDate) {
      setStudents([]);
      return;
    }

    try {
      setLoading(true);
      
      // 1. Fetch Students for the class
      const studentRes = await api.get(`/users?role=student&classId=${selectedClass}&limit=100`);
      const studentList = studentRes.data.users || [];
      setStudents(studentList);

      // 2. Fetch existing attendance records
      const attendanceRes = await api.get(`/attendance?classId=${selectedClass}&date=${selectedDate}`);
      const existingAttendance = attendanceRes.data || [];

      // Initialize attendance state
      const initialAttendance = {};
      const initialRemarks = {};
      
      // Map existing records
      existingAttendance.forEach(record => {
        if (record.student && record.student._id) {
          initialAttendance[record.student._id] = record.status;
          initialRemarks[record.student._id] = record.remarks || "";
        }
      });

      // Default others to "present"
      studentList.forEach(student => {
        if (!initialAttendance[student._id]) {
          initialAttendance[student._id] = "present";
        }
      });

      setAttendance(initialAttendance);
      setRemarks(initialRemarks);
      calculateStats(initialAttendance, studentList.length);

    } catch (err) {
      console.error("Fetch data error:", err);
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateStats = (currentAttendance, total) => {
    const counts = Object.values(currentAttendance).reduce((acc, status) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, { present: 0, absent: 0, late: 0, total });
    setStats(counts);
  };

  const handleStatusChange = (studentId, status) => {
    const newAttendance = { ...attendance, [studentId]: status };
    setAttendance(newAttendance);
    calculateStats(newAttendance, students.length);
  };

  const handleRemarkChange = (studentId, remark) => {
    setRemarks({ ...remarks, [studentId]: remark });
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);
      const attendanceData = students.map(student => ({
        studentId: student._id,
        status: attendance[student._id],
        remarks: remarks[student._id] || ""
      }));

      await api.post("/attendance/mark", {
        classId: selectedClass,
        date: selectedDate,
        attendanceData,
        subjectId: selectedSubject || null,
        markedBy: user?._id // metadata field addition
      });

      toast.success("Attendance synced successfully");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const filteredClasses = classes.filter(c => {
    let matchesYear = c.academicYear?._id === selectedYearId;
    if (!matchesYear) return false;
    if (user?.role === "teacher") {
      return c.classTeacher?._id === user?._id;
    }
    return true;
  });

  // Client-side processing: Search, Filter, Calculate Roll No
  const processedStudents = useMemo(() => {
    let result = students.map((student, index) => ({
      ...student,
      rollNo: (index + 1).toString().padStart(2, '0')
    }));

    if (searchTerm) {
      const lowerQuery = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(lowerQuery) || 
        s.rollNo.includes(lowerQuery)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(s => {
        const sStatus = attendance[s._id] || "present";
        return sStatus.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    return result;
  }, [students, searchTerm, statusFilter, attendance]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, selectedClass]);

  const totalPages = Math.ceil(processedStudents.length / studentsPerPage);
  const paginatedStudents = processedStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  return (
    <div className="p-8 lg:p-10 space-y-8 max-w-7xl mx-auto font-geist animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Attendance Registry</h2>
            {selectedClassObj?.classTeacher && (
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center gap-1.5 px-3 py-1 text-sm rounded-lg border-purple-100">
                <UserCheck className="w-4 h-4" />
                Class Teacher: {selectedClassObj.classTeacher.name}
              </Badge>
            )}
            {!selectedClassObj?.classTeacher && selectedClassObj && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 flex items-center gap-1.5 px-3 py-1 text-sm rounded-lg">
                <UserCheck className="w-4 h-4" />
                No Class Teacher Assigned
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-base max-w-lg">
            Mark daily attendance for students and monitor class performance.
          </p>
        </div>
        <div className="flex flex-col gap-2 relative">
           <Button 
            onClick={saveAttendance} 
            disabled={saving || loading || students.length === 0}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-white rounded-xl h-12 px-6 font-bold shadow-lg shadow-purple-200 dark:shadow-none w-full md:w-auto"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
            Sync Registry
          </Button>
          <div className="text-xs text-right text-slate-400 flex justify-end items-center gap-1">
            <input type="hidden" name="markedBy" value={user?._id || ""} />
            <span>Marking as: <strong className="text-purple-600 dark:text-purple-400">{user?.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Primary Filters Section */}
      <Card className="rounded-2xl border-none shadow-sm bg-white dark:bg-slate-900/50 p-2">
        <div className="flex flex-wrap items-center gap-3 p-2">
          <div className="flex-1 min-w-[200px]">
            <Label className="text-xs font-semibold text-slate-500 mb-1.5 ml-1 block">Academic Year</Label>
            <Select value={selectedYearId} onValueChange={setSelectedYearId}>
              <SelectTrigger className="rounded-xl border-slate-200 h-11 bg-slate-50 hover:bg-slate-100 transition-colors">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((yr) => (
                  <SelectItem key={yr._id} value={yr._id}>{yr.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label className="text-xs font-semibold text-slate-500 mb-1.5 ml-1 block">Class {user?.role === "teacher" && "(Assigned)"}</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="rounded-xl border-slate-200 h-11 bg-slate-50 hover:bg-slate-100 transition-colors">
                <SelectValue placeholder={filteredClasses.length ? "Select Class" : "No Classes"} />
              </SelectTrigger>
              <SelectContent>
                {filteredClasses.length === 0 && (
                  <SelectItem value="none" disabled>No classes found</SelectItem>
                )}
                {filteredClasses.map((cls) => (
                  <SelectItem key={cls._id} value={cls._id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label className="text-xs font-semibold text-slate-500 mb-1.5 ml-1 block">Subject (Optional)</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="rounded-xl border-slate-200 h-11 bg-slate-50 hover:bg-slate-100 transition-colors">
                <SelectValue placeholder="General / Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">General</SelectItem>
                {subjects.map((sub) => (
                  <SelectItem key={sub._id} value={sub._id}>{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label className="text-xs font-semibold text-slate-500 mb-1.5 ml-1 block">Date</Label>
            <div className="relative">
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-xl border-slate-200 h-11 bg-slate-50 hover:bg-slate-100 transition-colors w-full px-4 outline-none"
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Main Attendance List */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="rounded-3xl border-none shadow-xl shadow-slate-100 dark:shadow-none bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-50 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold">Student Roster</CardTitle>
                  <CardDescription>Records for {format(new Date(selectedDate), "MMMM do, yyyy")}</CardDescription>
                </div>
                
                {/* Secondary Search & Filter UI */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[200px]">
                    <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <Input 
                      type="text" 
                      placeholder="Search Name or Roll No..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-9 rounded-lg border-slate-200 text-sm focus-visible:ring-purple-500"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9 w-[130px] rounded-lg border-slate-200 text-sm">
                      <Filter className="w-4 h-4 mr-2 text-slate-400" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                      <SelectItem value="Late">Late</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
                </div>
              ) : paginatedStudents.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="w-[80px] font-bold text-slate-700 pl-6 text-center">Roll No</TableHead>
                        <TableHead className="w-[220px] font-bold text-slate-700">Student Name</TableHead>
                        <TableHead className="text-center font-bold text-slate-700 min-w-[200px]">Attendance Status</TableHead>
                        <TableHead className="pr-6 font-bold text-slate-700 min-w-[150px]">Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedStudents.map((student) => (
                        <TableRow key={student._id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-bold text-slate-500 pl-6 text-center">
                            {student.rollNo}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{student.name}</span>
                              <span className="text-xs text-slate-400 font-medium truncate max-w-[150px]">{student.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <RadioGroup 
                              value={attendance[student._id]} 
                              onValueChange={(val) => handleStatusChange(student._id, val)}
                              className="flex justify-center gap-3 sm:gap-4"
                            >
                              <div className="flex items-center space-x-1.5">
                                <RadioGroupItem value="present" id={`p-${student._id}`} className="text-emerald-500 w-4 h-4 border-emerald-200 focus-visible:ring-emerald-500" />
                                <Label htmlFor={`p-${student._id}`} className="text-xs font-bold cursor-pointer text-emerald-700">P</Label>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <RadioGroupItem value="absent" id={`a-${student._id}`} className="text-rose-500 w-4 h-4 border-rose-200 focus-visible:ring-rose-500" />
                                <Label htmlFor={`a-${student._id}`} className="text-xs font-bold cursor-pointer text-rose-700">A</Label>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <RadioGroupItem value="late" id={`l-${student._id}`} className="text-amber-500 w-4 h-4 border-amber-200 focus-visible:ring-amber-500" />
                                <Label htmlFor={`l-${student._id}`} className="text-xs font-bold cursor-pointer text-amber-700">L</Label>
                              </div>
                            </RadioGroup>
                          </TableCell>
                          <TableCell className="pr-6">
                            <Input 
                              placeholder="Add note..."
                              value={remarks[student._id] || ""}
                              onChange={(e) => handleRemarkChange(student._id, e.target.value)}
                              className="h-9 text-xs rounded-lg border-slate-200 focus-visible:ring-purple-500 focus:border-purple-500"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50 bg-slate-50/30">
                      <p className="text-xs text-slate-500 font-medium">
                        Showing {(currentPage - 1) * studentsPerPage + 1} to {Math.min(currentPage * studentsPerPage, processedStudents.length)} of {processedStudents.length} entries
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="h-8 shadow-sm rounded-lg border-slate-200"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                        </Button>
                        <div className="text-sm font-bold text-slate-700 px-3">
                          {currentPage} / {totalPages}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="h-8 shadow-sm rounded-lg border-slate-200"
                        >
                          Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-slate-50/50">
                    <Users className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">No Students Found</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">No students match your current filters or search criteria.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-2 space-y-6">
          <AiInsightWidget role={user?.role} />
          
          {/* Quick Insights styled with requested gradient */}
          <Card className="rounded-3xl border-none shadow-xl shadow-purple-100/50 dark:shadow-none bg-gradient-to-br from-purple-600 to-blue-600 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CheckCircle2 className="w-24 h-24" />
            </div>
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 opacity-80" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <p className="text-xs font-medium text-purple-100 uppercase tracking-widest mb-2 opacity-80">Attendance Rate</p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-extrabold tracking-tight">
                    {stats.total > 0 ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                  <p className="text-[10px] text-purple-100 font-bold tracking-widest mb-1 opacity-80">ON TIME</p>
                  <p className="text-2xl font-bold">{stats.present}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                  <p className="text-[10px] text-purple-100 font-bold tracking-widest mb-1 opacity-80">LATE</p>
                  <p className="text-2xl font-bold">{stats.late}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
