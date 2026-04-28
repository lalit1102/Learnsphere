import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Pencil, 
  Plus, 
  Save, 
  X, 
  Trophy, 
  Target, 
  ArrowRight,
  Loader2,
  BookOpen
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SyllabusManagement = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await api.get("/syllabus");
      setModules(res.data || []);
    } catch (error) {
      toast.error("Failed to load academic modules.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const calculateProgress = () => {
    if (modules.length === 0) return 0;
    const completed = modules.filter(m => m.status).length;
    return Math.round((completed / modules.length) * 100);
  };

  const handleAddModule = async () => {
    if (!newTitle.trim()) {
      toast.error("Module title is required.");
      return;
    }
    try {
      setSaving(true);
      const res = await api.post("/syllabus", { title: newTitle, order: modules.length + 1 });
      setModules([...modules, res.data]);
      setNewTitle("");
      setShowForm(false);
      toast.success("Module Added");
    } catch (error) {
      toast.error("Failed to append module.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await api.patch(`/syllabus/${id}`, { status: !currentStatus });
      setModules(modules.map(m => m._id === id ? res.data : m));
      toast.success("Module Updated");
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this module?")) return;
    try {
      await api.delete(`/syllabus/${id}`);
      setModules(modules.filter(m => m._id !== id));
      toast.success("Module Deleted");
    } catch (error) {
      toast.error("Failed to delete module.");
    }
  };

  const startEditing = (module) => {
    setEditingId(module._id);
    setEditTitle(module.title);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    try {
      const res = await api.patch(`/syllabus/${id}`, { title: editTitle });
      setModules(modules.map(m => m._id === id ? res.data : m));
      setEditingId(null);
      toast.success("Module Updated");
    } catch (error) {
      toast.error("Failed to update module title.");
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Initializing Academic Registry...</p>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-10 space-y-10 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[10px] font-black italic">Curriculum Control</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white italic">Syllabus Registry</h1>
          <p className="text-muted-foreground font-medium italic">Tracking academic modules and pedagogical milestones.</p>
        </div>
      </div>

      {/* Proficiency Card */}
      <Card className="rounded-[2.5rem] border-none shadow-2xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white p-10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Trophy className="h-48 w-48 rotate-12" />
         </div>
         
         <div className="relative space-y-8">
            <div className="flex justify-between items-end">
               <div className="space-y-2">
                  <h3 className="text-lg font-black uppercase tracking-widest italic opacity-80 flex items-center gap-2">
                     <Target className="h-5 w-5" /> Institutional Proficiency
                  </h3>
                  <div className="flex items-baseline gap-2">
                     <span className="text-7xl font-black italic tracking-tighter">{progress}%</span>
                     <span className="text-xl font-bold opacity-60 uppercase">Syllabus Finished</span>
                  </div>
               </div>
               <div className="hidden md:block text-right space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">Academic Status</p>
                  <p className="text-sm font-bold flex items-center gap-2">
                     {progress > 75 ? "Target Achieved" : "In Progress Pipeline"} <ArrowRight className="h-4 w-4" />
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
                  <span>Course Initialization</span>
                  <span>Institutional Target: 100%</span>
               </div>
            </div>
         </div>
      </Card>

      {/* Modules Section */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
               <BookOpen className="h-6 w-6 text-indigo-600" /> Academic Modules
            </h3>
            <Button 
              onClick={() => setShowForm(!showForm)}
              size="sm" 
              className="rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest h-9 px-6 shadow-xl hover:scale-105 transition-all active:scale-95"
            >
               {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />} 
               {showForm ? "Cancel" : "Append Module"}
            </Button>
         </div>

         <div className="grid grid-cols-1 gap-4">
            {/* Inline Add Form */}
            {showForm && (
              <Card className="rounded-xl bg-white shadow-sm border border-indigo-200 transition-all duration-300 ring-2 ring-indigo-50">
                 <div className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                       <Plus className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                       <Input 
                         autoFocus
                         placeholder="Enter module title..." 
                         value={newTitle}
                         onChange={(e) => setNewTitle(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
                         className="h-11 rounded-lg border-slate-200 focus-visible:ring-indigo-500 font-bold"
                       />
                       <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest ml-1">New Curriculum Entry</p>
                    </div>
                    <Button 
                      onClick={handleAddModule} 
                      disabled={saving}
                      className="h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black shrink-0 px-8"
                    >
                       {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Save
                    </Button>
                 </div>
              </Card>
            )}

            {/* Modules List */}
            {modules.map((module, idx) => (
              <Card key={module._id} className={cn(
                "rounded-xl bg-white shadow-sm border-slate-200 transition-all duration-300 hover:shadow-md",
                module.status ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-slate-200 border-t border-b border-r"
              )}>
                 <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div 
                      onClick={() => handleToggleStatus(module._id, module.status)}
                      className={cn(
                        "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90",
                        module.status 
                          ? "bg-emerald-50 text-emerald-600" 
                          : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                      )}
                    >
                       {module.status ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       {editingId === module._id ? (
                         <div className="flex items-center gap-2">
                           <Input 
                             autoFocus
                             value={editTitle}
                             onChange={(e) => setEditTitle(e.target.value)}
                             onKeyDown={(e) => e.key === 'Enter' && saveEdit(module._id)}
                             className="h-9 rounded-md border-slate-200 font-bold"
                           />
                           <Button size="icon" onClick={() => saveEdit(module._id)} className="h-9 w-9 rounded-md shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white">
                             <Save className="h-4 w-4" />
                           </Button>
                           <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-9 w-9 rounded-md shrink-0 text-slate-400">
                             <X className="h-4 w-4" />
                           </Button>
                         </div>
                       ) : (
                         <div className="space-y-0.5 pr-4">
                           <h4 className={cn(
                             "text-lg font-black tracking-tight truncate transition-colors",
                             module.status ? "text-slate-400" : "text-slate-900"
                           )}>
                              {module.title}
                           </h4>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              Module {idx + 1} 
                              {module.status ? <><span className="h-1 w-1 bg-emerald-500 rounded-full" /> Completed</> : <><span className="h-1 w-1 bg-amber-500 rounded-full" /> Pending</>}
                           </p>
                         </div>
                       )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 mt-4 sm:mt-0">
                       <Badge 
                         onClick={() => handleToggleStatus(module._id, module.status)}
                         className={cn(
                           "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full cursor-pointer hover:scale-105 transition-all mr-2",
                           module.status 
                             ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100" 
                             : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                         )}>
                          {module.status ? "● Completed" : "● Pending"}
                       </Badge>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => startEditing(module)}
                         className="h-9 w-9 rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                       >
                          <Pencil className="h-4 w-4" />
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => handleDelete(module._id)}
                         className="h-9 w-9 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                       >
                          <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                 </div>
              </Card>
            ))}

            {modules.length === 0 && !loading && !showForm && (
              <div className="p-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                 <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-slate-300" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Curriculum Empty</h3>
                    <p className="text-slate-500 font-medium text-sm mt-1">Start by appending a new pedagogical module.</p>
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default SyllabusManagement;
