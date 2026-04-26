import React, { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Clock, 
  User as UserIcon, 
  Coffee,
  Loader2,
  Printer,
  BookOpen,
  LayoutGrid,
  CalendarDays,
  AlarmClock,
  MapPin,
  MapPinned,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CustomSelect } from "@/components/global/CustomSelect";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// Configuration
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = Array.from({ length: 7 }, (_, i) => `${i + 8 < 10 ? '0' : ''}${i + 8}:00`); // 08:00 to 14:00

const TimetableManagement = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [conflictField, setConflictField] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { control, handleSubmit, reset, watch, register } = useForm({
    defaultValues: {
      day: "Monday",
      type: "Lecture",
      subject: "",
      teacher: "",
      startTime: "08:00",
      endTime: "09:00",
      roomNumber: ""
    }
  });

  const slotType = watch("type");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const [classRes, teacherRes] = await Promise.all([
        api.get("/classes"),
        api.get("/users?role=teacher")
      ]);
      const fetchedClasses = classRes.data?.classes || classRes.data || [];
      setClasses(fetchedClasses);
      setTeachers(teacherRes.data?.users || teacherRes.data || []);
    } catch (error) {
      toast.error("Failed to load initial data");
    }
  };

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      let data;
      if (isTeacher) {
        const res = await api.get(`/timetable/teacher/${user._id}`);
        data = res.data;
      } else if (selectedClass) {
        const res = await api.get(`/timetable/class/${selectedClass}`);
        data = res.data;
      }
      setTimetable(data || []);
      
      const subRes = await api.get(`/subjects`); 
      setSubjects(subRes.data.subjects || subRes.data || []);
    } catch (error) {
      toast.error("Failed to load academic schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isTeacher || selectedClass) {
      fetchTimetable();
    } else {
      setTimetable([]);
    }
  }, [selectedClass, isTeacher]);

  const onSubmit = async (data) => {
    setConflictField(null);
    try {
      if (editingSlot) {
        await api.put(`/timetable/${editingSlot._id}`, { ...data, classId: selectedClass });
        toast.success("Schedule updated");
      } else {
        await api.post("/timetable", { ...data, classId: selectedClass });
        toast.success("Slot scheduled");
      }
      setIsDialogOpen(false);
      setEditingSlot(null);
      reset();
      fetchTimetable();
    } catch (error) {
      const msg = error.response?.data?.message || "";
      if (msg.includes("Teacher Conflict")) setConflictField("teacher");
      if (msg.includes("Class Conflict")) setConflictField("class");
      toast.error(msg || "Scheduling conflict detected", { duration: 5000 });
    }
  };

  const handleEdit = (slot) => {
    if (!isAdmin) return;
    setEditingSlot(slot);
    setConflictField(null);
    reset({
      day: slot.day,
      type: slot.type,
      subject: slot.subject?._id || "",
      teacher: slot.teacher?._id || "",
      startTime: slot.startTime,
      endTime: slot.endTime,
      roomNumber: slot.roomNumber || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this entry?")) return;
    try {
      await api.delete(`/timetable/${id}`);
      toast.success("Slot decommissioned");
      setIsDialogOpen(false);
      setEditingSlot(null);
      fetchTimetable();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  // Helper to determine slot status
  const getSlotStatus = (slot) => {
    const dayToday = format(currentTime, "EEEE");
    const timeNow = format(currentTime, "HH:mm");
    if (slot.day === dayToday && slot.startTime <= timeNow && slot.endTime > timeNow) {
      return "active";
    }
    return "inactive";
  };

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[10px] font-black">
            {isTeacher ? "Personal Grid" : "Institutional Matrix"}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {isTeacher ? "My Personal Weekly Schedule" : "Academic Timetable"}
          </h1>
          <p className="text-muted-foreground font-medium italic text-sm">
            {isTeacher ? `Orchestrating academic delivery for Prof. ${user.name}` : "Orchestrating time, faculty, and knowledge delivery."}
          </p>
        </div>
        
        {isAdmin && (
          <div className="w-full md:w-64">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 block pl-1">Selected Cohort</label>
            <select 
              className="w-full h-11 rounded-2xl bg-white border border-slate-200 px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Choose a class...</option>
              {Array.isArray(classes) && classes.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Action Row - Only for Admins */}
      {isAdmin && (
        <div className="flex flex-row items-center gap-4 mb-6">
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
               setIsDialogOpen(open);
               if (!open) { setEditingSlot(null); setConflictField(null); reset(); }
             }}>
               <DialogTrigger asChild>
                 <Button disabled={!selectedClass} className="h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-30 flex items-center gap-2">
                   <Plus className="h-5 w-5" /> New Entry
                 </Button>
               </DialogTrigger>
               <DialogContent className="max-w-xl rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 max-h-[90vh] flex flex-col">
                 <div className="p-6 sm:p-8 space-y-4 flex flex-col h-full overflow-hidden">
                  <DialogHeader className="space-y-1">
                    <DialogTitle className="text-2xl sm:text-3xl font-black tracking-tighter italic uppercase text-slate-900 dark:text-white">
                      {editingSlot ? "Modify Allocation" : "Schedule Entry"}
                    </DialogTitle>
                    <DialogDescription className="font-medium text-slate-500 italic text-sm">
                      {editingSlot ? "Update temporal and faculty parameters." : "Designate a new period or institutional break."}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-5 py-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1 flex items-center gap-1.5">
                              <CalendarDays className="w-3 h-3 text-indigo-500" /> Academic Day
                            </label>
                            <CustomSelect 
                                control={control} 
                                name="day" 
                                options={DAYS.map(d => ({label: d, value: d}))} 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1 flex items-center gap-1.5">
                              <LayoutGrid className="w-3 h-3 text-indigo-500" /> Session Type
                            </label>
                            <CustomSelect 
                                control={control} 
                                name="type" 
                                options={[{label: "Lecture", value: "Lecture"}, {label: "Break", value: "Break"}]} 
                            />
                          </div>
                      </div>

                      {slotType === "Lecture" && (
                        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1 flex items-center gap-1.5">
                              <BookOpen className="w-3 h-3 text-indigo-500" /> Subject Area
                            </label>
                            <CustomSelect 
                                control={control} 
                                name="subject" 
                                options={subjects.map(s => ({label: s.name, value: s._id}))} 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className={cn(
                              "text-[9px] font-black uppercase tracking-widest pl-1 flex items-center gap-1.5",
                              conflictField === 'teacher' ? "text-rose-500" : "text-slate-400"
                            )}>
                              <UserIcon className={cn("w-3 h-3", conflictField === 'teacher' ? "text-rose-500" : "text-indigo-500")} /> 
                              Instructor {conflictField === 'teacher' && "— Conflict"}
                            </label>
                            <CustomSelect 
                                control={control} 
                                name="teacher" 
                                options={teachers.map(t => ({label: t.name, value: t._id}))} 
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5 pt-2">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-indigo-500" /> Room Number / Location
                        </label>
                        <Input 
                          {...register("roomNumber")}
                          placeholder="e.g. Lab 201, Room 10-A"
                          className="h-10 rounded-xl bg-slate-50 dark:bg-white/5 border-none font-bold text-slate-700 dark:text-white px-4 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/10">
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1 flex items-center gap-1.5">
                              <AlarmClock className="w-3 h-3 text-indigo-500" /> Start Time
                            </label>
                            <div className="relative group">
                              <Input 
                                type="time" 
                                {...register("startTime")} 
                                className="h-10 rounded-xl bg-slate-50 dark:bg-white/5 border-none font-bold px-4 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm" 
                              />
                              <Clock className="absolute right-3 top-3 w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-indigo-500" /> End Time
                            </label>
                            <div className="relative group">
                              <Input 
                                type="time" 
                                {...register("endTime")} 
                                className="h-10 rounded-xl bg-slate-50 dark:bg-white/5 border-none font-bold px-4 focus-visible:ring-2 focus-visible:ring-indigo-500 text-sm" 
                              />
                              <Clock className="absolute right-3 top-3 w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                            </div>
                          </div>
                      </div>
                    </div>

                    <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 pt-5 border-t border-slate-100 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm -mx-8 px-8 pb-8 shrink-0">
                      {editingSlot && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => handleDelete(editingSlot._id)}
                            className="flex-1 h-11 text-rose-500 hover:text-rose-600 font-black uppercase tracking-widest text-[9px] hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20"
                          >
                              <Trash2 className="w-3.5 h-3.5 mr-2" /> Decommission
                          </Button>
                        )}
                        <Button type="submit" className="flex-[2] h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 dark:shadow-none uppercase tracking-widest italic transition-all active:scale-95 text-xs">
                          Save Schedule
                        </Button>
                    </DialogFooter>
                  </form>
                 </div>
               </DialogContent>
            </Dialog>

            <Button variant="outline" className="h-11 px-4 flex items-center gap-2 rounded-2xl border-slate-200 hover:bg-slate-50 transition-colors">
              <Printer className="h-5 w-5 text-slate-400" />
              <span className="text-xs font-bold text-slate-600">Print Registry</span>
            </Button>
        </div>
      )}

      {!isTeacher && !selectedClass ? (
        <div className="h-[600px] border-2 border-dashed rounded-[3.5rem] border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50 bg-white dark:bg-white/5 shadow-inner animate-in zoom-in duration-1000">
           <Calendar className="h-24 w-24 stroke-[1]" />
           <p className="font-black text-2xl italic tracking-tight uppercase text-center">Select an Institutional Cohort to Initialize Grid</p>
        </div>
      ) : loading ? (
        <div className="h-[600px] flex flex-col items-center justify-center gap-4">
           <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
           <p className="text-sm font-black text-slate-400 italic">Syncing Temporal Matrix...</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-8 animate-in slide-in-from-bottom duration-700">
           <div className="min-w-[1200px] grid grid-cols-7 gap-px rounded-[3.5rem] overflow-hidden border border-slate-100 dark:border-white/5 bg-slate-100 dark:bg-white/5 shadow-2xl">
              {/* Header Row */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-col items-center justify-center border-b border-r border-slate-100 dark:border-white/5">
                 <Clock className="h-6 w-6 text-slate-300 mb-2" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Time Matrix</span>
              </div>
              {DAYS.map(day => (
                <div key={day} className="bg-slate-50 dark:bg-slate-900/50 p-6 flex items-center justify-center border-b border-slate-100 dark:border-white/5">
                   <span className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white italic">{day}</span>
                </div>
              ))}

              {/* Data Rows */}
              {HOURS.map((hour, idx) => (
                <React.Fragment key={hour}>
                  <div className="bg-white dark:bg-slate-900 p-6 flex items-center justify-center border-r border-slate-100 dark:border-white/5">
                     <span className="text-xs font-black text-slate-400 tracking-tighter">{hour}</span>
                  </div>
                  
                  {DAYS.map(day => {
                    const slots = timetable.filter(s => s.day === day && s.startTime.startsWith(hour.split(":")[0]));
                    return (
                      <div key={`${day}-${hour}`} className={cn(
                        "h-48 p-3 flex flex-col gap-2 group relative transition-colors",
                        slots.length > 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-white/5"
                      )}>
                        {slots.map(slot => {
                          const status = getSlotStatus(slot);
                          const isActive = status === "active";
                          
                          return (
                            <div 
                              key={slot._id}
                              onClick={() => handleEdit(slot)}
                              className={cn(
                                "p-4 rounded-3xl border shadow-sm relative overflow-hidden flex flex-col h-full transition-all animate-in zoom-in duration-300",
                                isAdmin && "cursor-pointer hover:scale-[1.02] hover:shadow-xl active:scale-95",
                                isActive 
                                  ? "bg-emerald-500 text-white border-emerald-400 ring-4 ring-emerald-500/20 z-10 animate-pulse-emerald shadow-lg shadow-emerald-200" 
                                  : (slot.type === "Break" 
                                      ? "bg-slate-900 text-white border-slate-700" 
                                      : "bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-900/20 dark:text-rose-100 dark:border-rose-500/20")
                              )}
                            >
                              {/* Content Layout: Subject (Bold), Cohort/Room, Time (Bottom) */}
                              <div className="flex flex-col h-full space-y-1.5">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-black text-sm tracking-tight italic line-clamp-1 leading-none">
                                    {slot.subject?.name || (slot.type === "Break" ? "Institutional Break" : "Untitled")}
                                  </h4>
                                  {isActive && <Activity className="w-3.5 h-3.5 animate-bounce" />}
                                </div>

                                <div className="flex flex-col gap-0.5 opacity-80">
                                   <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide">
                                      <LayoutGrid className={cn("h-3 w-3", isActive ? "text-emerald-100" : "text-rose-500")} /> 
                                      {slot.class?.name}
                                   </div>
                                   <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wide">
                                      <MapPin className={cn("h-3 w-3", isActive ? "text-emerald-100" : "text-rose-500")} /> 
                                      {slot.roomNumber || slot.class?.roomNumber || "Wing A"}
                                   </div>
                                </div>

                                {slot.type === "Break" && (
                                   <div className="flex-1 flex items-center justify-center opacity-30">
                                      <Coffee className="h-5 w-5" />
                                   </div>
                                )}

                                <div className="mt-auto pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/5">
                                   <span className={cn(
                                     "text-[10px] font-black tracking-tighter",
                                     isActive ? "text-emerald-50" : "text-slate-400"
                                   )}>
                                      {slot.startTime} - {slot.endTime}
                                   </span>
                                   {isActive && (
                                      <Badge className="bg-white text-emerald-600 text-[8px] h-4 font-black border-none px-1.5">LIVE</Badge>
                                   )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
           </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-emerald {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          50% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        }
        .animate-pulse-emerald {
          animation: pulse-emerald 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default TimetableManagement;
