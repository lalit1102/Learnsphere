import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Loader2,
  Trophy,
  Target,
  ArrowRight,
  Plus,
  RefreshCw,
  MoreVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SyllabusManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      const subjectsData = Array.isArray(res.data) ? res.data : (res.data.subjects || []);
      setSubjects(subjectsData);
      
      if (subjectsData.length > 0) {
        setSelectedSubject(subjectsData[0]._id);
      } else {
        setLoading(false); // Stop loading if no subjects found
      }
    } catch (error) {
      console.error("Subject Fetch Error:", error);
      toast.error("Failed to load subject registry");
      setLoading(false);
    }
  };

  const fetchSyllabus = async (subjectId) => {
    if (!subjectId) return;
    try {
      setLoading(true);
      const res = await api.get(`/syllabus/${subjectId}`);
      setSyllabus(res.data);
    } catch (error) {
      toast.error("Failed to synchronize academic modules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchSyllabus(selectedSubject);
    }
  }, [selectedSubject]);

  const toggleChapter = async (chapterId, currentStatus) => {
    try {
      setSyncing(true);
      const res = await api.patch(`/syllabus/${syllabus._id}/chapters/${chapterId}`, {
        isCompleted: !currentStatus
      });
      setSyllabus(res.data.syllabus);
      toast.success(`Chapter marked as ${!currentStatus ? 'Completed' : 'Pending'}`);
    } catch (error) {
      toast.error("Status synchronization failed");
    } finally {
      setSyncing(false);
    }
  };

  const calculateProgress = () => {
    if (!syllabus || !syllabus.chapters.length) return 0;
    const completed = syllabus.chapters.filter(c => c.isCompleted).length;
    return Math.round((completed / syllabus.chapters.length) * 100);
  };

  const toggleExpand = (id) => {
    setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Initializing Academic Registry...</p>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="h-24 w-24 rounded-[2.5rem] bg-indigo-50 flex items-center justify-center text-indigo-600">
           <BookOpen className="h-12 w-12" />
        </div>
        <div className="text-center space-y-2">
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">No Subjects Found</h2>
           <p className="text-slate-400 font-bold text-sm">Initialize subjects in the academic registry to begin curriculum tracking.</p>
        </div>
        <Button onClick={() => navigate("/academics/subjects")} className="rounded-2xl bg-slate-900 px-8 h-12 font-black uppercase tracking-widest text-[10px]">Go to Subject Management</Button>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="p-8 lg:p-10 max-w-6xl mx-auto space-y-10 font-geist animate-in fade-in duration-700">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[10px] font-black italic">Curriculum Control</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white italic">Syllabus Registry</h1>
          <p className="text-muted-foreground font-medium italic">Tracking academic modules and pedagogical milestones.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full md:w-64 h-12 rounded-2xl bg-white border-slate-200 font-bold text-slate-700 shadow-sm transition-all focus:ring-indigo-500">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
              {subjects.map((sub) => (
                <SelectItem key={sub._id} value={sub._id} className="rounded-xl py-3 font-bold cursor-pointer">
                  {sub.name} ({sub.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-12 w-12 rounded-2xl p-0 border-slate-200 hover:bg-indigo-50 text-indigo-600">
             <RefreshCw className={cn("h-5 w-5", syncing && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Progress Overview Card */}
      <Card className="rounded-[3rem] border-none shadow-2xl shadow-indigo-100 dark:shadow-none bg-gradient-to-br from-indigo-600 to-slate-900 text-white p-10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Trophy className="h-48 w-48 rotate-12" />
         </div>
         
         <div className="relative space-y-8">
            <div className="flex justify-between items-end">
               <div className="space-y-2">
                  <h3 className="text-lg font-black uppercase tracking-widest italic opacity-80 flex items-center gap-2">
                     <Target className="h-5 w-5" /> Overall Proficiency
                  </h3>
                  <div className="flex items-baseline gap-2">
                     <span className="text-7xl font-black italic tracking-tighter">{progress}%</span>
                     <span className="text-xl font-bold opacity-60 uppercase">Completed</span>
                  </div>
               </div>
               <div className="hidden md:block text-right space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">Next Milestone</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                     Final Module Release <ArrowRight className="h-4 w-4" />
                  </p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="h-4 bg-white/10 rounded-full overflow-hidden p-1 shadow-inner">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    style={{ width: `${progress}%` }}
                  />
               </div>
               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest italic opacity-60">
                  <span>Start Curriculum</span>
                  <span>Institutional Target: 100%</span>
               </div>
            </div>
         </div>
      </Card>

      {/* Chapters Timeline/List */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
               <BookOpen className="h-6 w-6 text-indigo-600" /> Academic Modules
            </h3>
            <Button size="sm" className="rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest h-9 px-6 shadow-xl hover:scale-105 transition-all active:scale-95">
               <Plus className="h-4 w-4 mr-2" /> Append Module
            </Button>
         </div>

         <div className="grid grid-cols-1 gap-6">
            {syllabus?.chapters.map((chapter, idx) => (
               <Collapsible 
                 key={chapter._id} 
                 open={expandedChapters[chapter._id]} 
                 onOpenChange={() => toggleExpand(chapter._id)}
                 className="group"
               >
                  <Card className={cn(
                    "rounded-[2.5rem] border-none shadow-xl transition-all duration-500",
                    chapter.isCompleted ? "bg-white opacity-80" : "bg-white shadow-indigo-50/50"
                  )}>
                     <div className="p-8">
                        <div className="flex items-center gap-6">
                           <div 
                             onClick={(e) => {
                               e.stopPropagation();
                               toggleChapter(chapter._id, chapter.isCompleted);
                             }}
                             className={cn(
                               "h-14 w-14 rounded-3xl flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-90",
                               chapter.isCompleted 
                                 ? "bg-indigo-600 text-white shadow-indigo-200" 
                                 : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                             )}
                           >
                              {chapter.isCompleted ? <CheckCircle2 className="h-7 w-7" /> : <Circle className="h-7 w-7" />}
                           </div>
                           
                           <CollapsibleTrigger asChild>
                              <div className="flex-1 cursor-pointer select-none">
                                 <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                       <div className="flex items-center gap-3">
                                          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest opacity-60 italic">Chapter {idx + 1}</span>
                                          {chapter.isCompleted && <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[8px] uppercase tracking-widest h-5 px-2">Verified Complete</Badge>}
                                       </div>
                                       <h4 className={cn(
                                         "text-xl font-black italic tracking-tight transition-colors",
                                         chapter.isCompleted ? "text-slate-500 line-through decoration-indigo-600/30" : "text-slate-900"
                                       )}>
                                          {chapter.title}
                                       </h4>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                          {expandedChapters[chapter._id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                       </div>
                                       <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-slate-300">
                                          <MoreVertical className="h-5 w-5" />
                                       </Button>
                                    </div>
                                 </div>
                              </div>
                           </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent className="pt-8 pl-20 animate-in slide-in-from-top-4 duration-500">
                           <div className="space-y-6">
                              <p className="text-sm font-medium text-slate-500 leading-relaxed italic max-w-2xl">
                                 {chapter.description || "No pedagogical description provided for this academic module. Please synchronize with the department guidelines."}
                              </p>
                              
                              <div className="flex items-center gap-8 pt-4 border-t border-slate-50">
                                 <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Target Status</span>
                                    <span className={cn("text-xs font-black uppercase", chapter.isCompleted ? "text-indigo-600" : "text-amber-500")}>
                                       {chapter.isCompleted ? "Institutional Success" : "Pedagogical Pipeline"}
                                    </span>
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Last Modified</span>
                                    <span className="text-xs font-black text-slate-600 italic">
                                       {chapter.completedAt ? new Date(chapter.completedAt).toLocaleDateString() : "Pending Registry"}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </CollapsibleContent>
                     </div>
                  </Card>
               </Collapsible>
            ))}
         </div>
      </div>
    </div>
  );
};

export default SyllabusManagement;
