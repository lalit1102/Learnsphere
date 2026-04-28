import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Users, Search, Save, Loader2, Calendar as CalendarIcon, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

const AttendanceManagement = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("all");
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(new Date());

  // Fetch Students & Classes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, classesRes] = await Promise.all([
          api.get("/students"),
          api.get("/classes")
        ]);

        const studentList = studentsRes.data.users || studentsRes.data || [];
        const classList = classesRes.data.classes || classesRes.data || [];
        
        setStudents(studentList);
        setClasses(classList);
        
        // Initialize attendance state (default all to Present)
        const initialStatus = {};
        studentList.forEach(s => {
          initialStatus[s._id] = "Present";
        });
        setAttendance(initialStatus);
      } catch (error) {
        toast.error("Failed to fetch registry data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusToggle = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const processedStudents = useMemo(() => {
    let list = students.map((s, idx) => ({ ...s, rollNo: `R${(idx + 1).toString().padStart(3, '0')}` }));
    
    // Class Filter
    if (selectedClass !== "all") {
      list = list.filter(s => {
        const sClassId = typeof s.studentClass === 'object' ? s.studentClass?._id : s.studentClass;
        return sClassId === selectedClass;
      });
    }

    // Search Filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q));
    }
    return list;
  }, [students, searchTerm, selectedClass]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        date: format(date, "yyyy-MM-dd"),
        attendanceData: processedStudents.map(s => ({
          studentId: s._id,
          status: attendance[s._id].toLowerCase()
        }))
      };

      await api.post("/attendance", payload);
      toast.success("Attendance synced successfully");
    } catch (error) {
      toast.error("Failed to sync attendance");
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    processedStudents.forEach(s => {
      const status = attendance[s._id];
      if (status === "Present" || status === "Late") present++;
      if (status === "Absent") absent++;
    });
    return { total: processedStudents.length, present, absent };
  }, [processedStudents, attendance]);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Initializing Registry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-10 space-y-8 font-geist animate-in fade-in duration-700">
      
      {/* Header & Stats */}
      <div className="space-y-6">
        <div>
          <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[10px] font-black italic">Daily Registry</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white italic">Student Attendance</h1>
          <p className="text-muted-foreground font-medium italic mt-1">Manage daily presence and institutional punctuality.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-2xl border-none shadow-sm bg-white p-6 flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filtered Students</p>
               <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.total}</h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
               <Users className="h-6 w-6" />
            </div>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm bg-white p-6 flex items-center justify-between border-l-4 border-l-emerald-500">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70">Present Today</p>
               <h3 className="text-3xl font-black text-emerald-600 mt-1">{stats.present}</h3>
            </div>
          </Card>
          <Card className="rounded-2xl border-none shadow-sm bg-white p-6 flex items-center justify-between border-l-4 border-l-red-500">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-red-600/70">Absent Today</p>
               <h3 className="text-3xl font-black text-red-600 mt-1">{stats.absent}</h3>
            </div>
          </Card>
        </div>
      </div>

      {/* Toolbar: Filters & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
         <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Class Filter Dropdown */}
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl border-slate-200 font-bold focus:ring-indigo-500">
                <Filter className="w-4 h-4 mr-2 text-indigo-500" />
                <SelectValue placeholder="Filter by Class" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl">
                <SelectItem value="all" className="font-bold">All Classes</SelectItem>
                {classes.map(cls => (
                  <SelectItem key={cls._id} value={cls._id} className="font-medium">
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search students by name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-xl border-slate-200 bg-slate-50/50 font-medium focus-visible:ring-indigo-500 w-full"
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn(
                  "w-full sm:w-auto h-11 justify-start text-left font-bold rounded-xl border-slate-200 bg-slate-50/50 hover:bg-slate-100",
                  !date && "text-muted-foreground"
                )}>
                  <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
         </div>

         <Button 
           onClick={handleSave} 
           disabled={saving || processedStudents.length === 0}
           className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 shadow-md w-full lg:w-auto shrink-0"
         >
           {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Submit Attendance
         </Button>
      </div>

      {/* Main Table */}
      <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="w-[120px] font-black text-[10px] uppercase tracking-widest text-slate-400 pl-6">Roll No</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Student Name</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Class</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-slate-400 pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedStudents.map((student) => {
                 const st = attendance[student._id];
                 const sClassId = typeof student.studentClass === 'object' ? student.studentClass?._id : student.studentClass;
                 const className = classes.find(c => c._id === sClassId)?.name || "Unassigned";

                 return (
                   <TableRow key={student._id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                     <TableCell className="pl-6 font-bold text-slate-500">
                       {student.rollNo}
                     </TableCell>
                     <TableCell className="font-bold text-slate-900">
                       {student.name}
                       {student.email && <span className="block text-xs font-medium text-slate-400 mt-0.5">{student.email}</span>}
                     </TableCell>
                     <TableCell>
                       <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-none">
                         {className}
                       </Badge>
                     </TableCell>
                     <TableCell className="pr-6 text-right">
                       <div className="inline-flex bg-slate-50 rounded-lg p-1 border border-slate-100">
                          {["Present", "Absent", "Late"].map(opt => {
                            const isActive = st === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() => handleStatusToggle(student._id, opt)}
                                className={cn(
                                  "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all",
                                  isActive 
                                    ? (opt === "Present" ? "bg-emerald-100 text-emerald-700 shadow-sm" : 
                                       opt === "Absent" ? "bg-red-100 text-red-700 shadow-sm" : 
                                       "bg-amber-100 text-amber-700 shadow-sm")
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                )}
                              >
                                {opt}
                              </button>
                            );
                          })}
                       </div>
                     </TableCell>
                   </TableRow>
                 );
              })}

              {processedStudents.length === 0 && (
                <TableRow>
                   <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                         <Users className="h-12 w-12 text-slate-200" />
                         <p className="text-sm font-bold text-slate-400">No students found matching your criteria.</p>
                      </div>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
    </div>
  );
};

export default AttendanceManagement;
