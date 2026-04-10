import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Clock, 
  User as UserIcon, 
  BookOpen, 
  Coffee,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Printer
} from "lucide-react";
import { toast } from "sonner";

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

// Configuration
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = Array.from({ length: 7 }, (_, i) => `${i + 8 < 10 ? '0' : ''}${i + 8}:00`); // 08:00 to 14:00

const SUBJECT_COLORS = [
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-sky-100 text-sky-700 border-sky-200",
  "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
];

const TimetableManagement = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      day: "Monday",
      type: "Lecture",
      subject: "",
      teacher: "",
      startTime: "08:00",
      endTime: "09:00",
    }
  });

  const slotType = watch("type");

  const fetchData = async () => {
    try {
      const [classRes, teacherRes] = await Promise.all([
        api.get("/classes"),
        api.get("/users?role=teacher")
      ]);
      setClasses(classRes.data || []);
      setTeachers(teacherRes.data.users || []);
    } catch (error) {
      toast.error("Failed to load initial data");
    }
  };

  const fetchClassTimetable = async (classId) => {
    if (!classId) return;
    try {
      setLoading(true);
      const { data } = await api.get(`/timetable/class/${classId}`);
      setTimetable(data || []);
      
      // Also fetch subjects for this specific class to populate the dropdown
      const classObj = classes.find(c => c._id === classId);
      if (classObj) {
         // Assuming class object has populated subjects or we fetch them
         const subRes = await api.get(`/subjects`); 
         setSubjects(subRes.data || []);
      }
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
    if (selectedClass) fetchClassTimetable(selectedClass);
  }, [selectedClass]);

  const onSubmit = async (data) => {
    try {
      await api.post("/timetable", { ...data, classId: selectedClass });
      toast.success("Schedule entry authorized");
      setIsDialogOpen(false);
      reset();
      fetchClassTimetable(selectedClass);
    } catch (error) {
      const msg = error.response?.data?.message || "Scheduling conflict detected";
      toast.error(msg, { duration: 5000 });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/timetable/${id}`);
      toast.success("Slot removed from registry");
      fetchClassTimetable(selectedClass);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const getSubjectColor = (subjectId) => {
    if (!subjectId) return "bg-slate-100 text-slate-500 border-slate-200";
    const index = subjects.findIndex(s => s._id === subjectId) % SUBJECT_COLORS.length;
    return SUBJECT_COLORS[index] || SUBJECT_COLORS[0];
  };

  return (
    <div className="p-8 lg:p-10 max-w-[1600px] mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[10px] font-black">Spatial Logic</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Academic Timetable</h1>
          <p className="text-muted-foreground font-medium italic">Orchestrating time, faculty, and knowledge delivery.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="w-full md:w-64">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 block pl-1">Target Class</label>
              <select 
                className="w-full h-11 rounded-2xl bg-white border border-slate-200 px-4 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Select a cohort...</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
           </div>

           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
             <DialogTrigger asChild>
               <Button disabled={!selectedClass} className="h-11 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-30">
                 <Plus className="h-5 w-5 mr-2" /> Schedule Slot
               </Button>
             </DialogTrigger>
             <DialogContent className="max-w-md rounded-[2.5rem] p-8 border-none shadow-2xl">
               <DialogHeader>
                 <DialogTitle className="text-2xl font-black tracking-tighter italic uppercase">Time Allocation</DialogTitle>
                 <DialogDescription className="font-medium italic">Configure a new academic period or break interval.</DialogDescription>
               </DialogHeader>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
                 <div className="grid grid-cols-2 gap-4">
                    <CustomSelect 
                        control={control} 
                        name="day" 
                        label="Academic Day" 
                        options={DAYS.map(d => ({label: d, value: d}))} 
                    />
                    <CustomSelect 
                        control={control} 
                        name="type" 
                        label="Session Type" 
                        options={[{label: "Lecture", value: "Lecture"}, {label: "Break", value: "Break"}]} 
                    />
                 </div>

                 {slotType === "Lecture" && (
                   <>
                    <CustomSelect 
                        control={control} 
                        name="subject" 
                        label="Subject Area" 
                        options={subjects.map(s => ({label: s.name, value: s._id}))} 
                    />
                    <CustomSelect 
                        control={control} 
                        name="teacher" 
                        label="Instructor" 
                        options={teachers.map(t => ({label: t.name, value: t._id}))} 
                    />
                   </>
                 )}

                 <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1 leading-none">Commence</label>
                       <Input type="time" {...control.register("startTime")} className="h-11 rounded-xl bg-slate-50 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1 leading-none">Conclude</label>
                       <Input type="time" {...control.register("endTime")} className="h-11 rounded-xl bg-slate-50 border-none font-bold" />
                    </div>
                 </div>

                 <DialogFooter className="mt-8">
                   <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black shadow-xl uppercase tracking-widest italic">
                      Finalize Allocation
                   </Button>
                 </DialogFooter>
               </form>
             </DialogContent>
           </Dialog>

           <Button variant="outline" className="h-11 w-11 p-0 rounded-2xl border-slate-200">
              <Printer className="h-5 w-5 text-slate-400" />
           </Button>
        </div>
      </div>

      {!selectedClass ? (
        <div className="h-[600px] border-2 border-dashed rounded-[3.5rem] border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50 bg-white shadow-inner animate-in zoom-in duration-1000">
           <Calendar className="h-24 w-24 stroke-[1]" />
           <p className="font-black text-2xl italic tracking-tight uppercase">Select an Institutional Cohort to Initialize Grid</p>
        </div>
      ) : loading ? (
        <div className="h-[600px] flex flex-col items-center justify-center gap-4">
           <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
           <p className="text-sm font-black text-slate-400 italic">Syncing Temporal Matrix...</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-8 animate-in slide-in-from-bottom duration-700">
           <div className="min-w-[1200px] grid grid-cols-7 gap-px rounded-[3.5rem] overflow-hidden border border-slate-100 bg-slate-100 shadow-2xl">
              {/* Header Row */}
              <div className="bg-slate-50 p-6 flex flex-col items-center justify-center border-b border-r border-slate-100">
                 <Clock className="h-6 w-6 text-slate-300 mb-2" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time Matrix</span>
              </div>
              {DAYS.map(day => (
                <div key={day} className="bg-slate-50 p-6 flex items-center justify-center border-b border-slate-100">
                   <span className="text-sm font-black uppercase tracking-widest text-slate-900 italic">{day}</span>
                </div>
              ))}

              {/* Data Rows */}
              {HOURS.map((hour, idx) => (
                <React.Fragment key={hour}>
                  {/* Time Column */}
                  <div className="bg-white p-6 flex items-center justify-center border-r border-slate-100">
                     <span className="text-xs font-black text-slate-400 tracking-tighter">{hour}</span>
                  </div>
                  
                  {/* Day Columns for this Hour */}
                  {DAYS.map(day => {
                    const slots = timetable.filter(s => s.day === day && s.startTime.startsWith(hour.split(":")[0]));
                    return (
                      <div key={`${day}-${hour}`} className="bg-white h-40 p-3 flex flex-col gap-2 group relative transition-colors hover:bg-slate-50/50">
                        {slots.map(slot => (
                          <div 
                            key={slot._id}
                            className={`p-4 rounded-3xl border shadow-sm relative overflow-hidden flex flex-col h-full ${
                              slot.type === "Break" 
                                ? "bg-slate-900 text-white border-slate-700" 
                                : getSubjectColor(slot.subject?._id)
                            } animate-in zoom-in duration-300`}
                          >
                            <div className="flex justify-between items-start mb-1">
                               <Badge variant="outline" className={`text-[8px] h-4 font-black border-none uppercase tracking-tighter ${slot.type === "Break" ? "bg-white/10 text-white" : "bg-black/5"}`}>
                                  {slot.startTime} - {slot.endTime}
                               </Badge>
                               <Button 
                                onClick={() => handleDelete(slot._id)}
                                variant="ghost" 
                                size="icon" 
                                className={`h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${slot.type === "Break" ? "hover:bg-white/10 text-white" : "hover:bg-black/5"}`}
                               >
                                  <Trash2 className="h-3 w-3" />
                               </Button>
                            </div>
                            
                            {slot.type === "Break" ? (
                              <div className="flex flex-col items-center justify-center flex-1 gap-1">
                                 <Coffee className="h-6 w-6 opacity-30" />
                                 <span className="font-black text-xs uppercase tracking-widest italic">{slot.type}</span>
                              </div>
                            ) : (
                              <div className="flex flex-col flex-1">
                                 <h4 className="font-black text-sm tracking-tight line-clamp-2 leading-none mb-2 italic">
                                   {slot.subject?.name}
                                 </h4>
                                 <div className="mt-auto flex items-center gap-1.5 opacity-60">
                                    <UserIcon className="h-3 w-3" />
                                    <span className="text-[10px] font-bold truncate">{slot.teacher?.name}</span>
                                 </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default TimetableManagement;
