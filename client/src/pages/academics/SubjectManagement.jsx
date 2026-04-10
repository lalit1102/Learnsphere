import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  BookOpen, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  GraduationCap, 
  Hash, 
  Layers,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { CustomInput } from "@/components/global/CustomInput";
import { CustomSelect } from "@/components/global/CustomSelect";
import { MultiSelect } from "@/components/ui/multi-select"; // Assuming a MultiSelect component exists or using a standard select
import { useForm } from "react-hook-form";

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      code: "",
      category: "Core",
      credits: 0,
      teacher: [],
    }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subjRes, classRes, teacherRes] = await Promise.all([
        api.get("/subjects"),
        api.get("/classes"),
        api.get("/users?role=teacher")
      ]);
      setSubjects(subjRes.data || []);
      setClasses(classRes.data || []);
      setTeachers(teacherRes.data.users || []);
    } catch (error) {
      toast.error("Failed to synchronize curriculum data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, classes: selectedClasses };
      if (editingSubject) {
        await api.put(`/subjects/${editingSubject._id}`, payload);
        toast.success("Curriculum profile updated");
      } else {
        await api.post("/subjects", payload);
        toast.success("New academic subject registered");
      }
      setIsDialogOpen(false);
      setEditingSubject(null);
      setSelectedClasses([]);
      reset();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this subject from the record?")) return;
    try {
      await api.delete(`/subjects/${id}`);
      toast.success("Subject successfully removed");
      fetchData();
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const openEditDialog = (subj) => {
    setEditingSubject(subj);
    reset({
      name: subj.name,
      code: subj.code,
      category: subj.category,
      credits: subj.credits,
      teacher: subj.teacher?.map(t => t._id) || [],
    });
    setSelectedClasses(subj.assignedClasses?.map(c => c._id) || []);
    setIsDialogOpen(true);
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const teacherOptions = teachers.map(t => ({ label: t.name, value: t._id }));
  const classOptions = Array.isArray(classes) ? classes.map(c => ({ label: c.name, value: c._id })) : [];

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-widest text-[10px] font-black">Curriculum Registry</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Subject Repository</h1>
          <p className="text-muted-foreground font-medium italic">Defining the academic backbone and learning credits.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search Subject ID or Title..." 
                className="pl-10 h-11 rounded-2xl bg-white border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Dialog open={isDialogOpen} onOpenChange={(open) => {
             setIsDialogOpen(open);
             if(!open) { setEditingSubject(null); reset(); setSelectedClasses([]); }
           }}>
             <DialogTrigger asChild>
               <Button className="h-11 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg transition-all active:scale-95">
                 <Plus className="h-5 w-5 mr-2" /> Register Subject
               </Button>
             </DialogTrigger>
             <DialogContent className="max-w-md rounded-[2.5rem] p-8 border-none shadow-2xl">
               <DialogHeader className="mb-4">
                 <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Subject Architecture</DialogTitle>
                 <DialogDescription className="font-medium">Define metadata and spatial distribution for this course.</DialogDescription>
               </DialogHeader>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                 <div className="grid grid-cols-2 gap-4">
                    <CustomInput control={control} name="name" label="Subject Name" placeholder="e.g. Mathematics" rules={{required: true}} />
                    <CustomInput control={control} name="code" label="Subject Code" placeholder="e.g. MATH-101" rules={{required: true}} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <CustomSelect 
                        control={control} 
                        name="category" 
                        label="Category" 
                        options={[{label: "Core", value: "Core"}, {label: "Elective", value: "Elective"}, {label: "Practical", value: "Practical"}]} 
                    />
                    <CustomInput control={control} name="credits" label="Credit Weight" type="number" placeholder="4" />
                 </div>

                 {/* Class Mapping (Simplified multi-select for now) */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Target Classes</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-3 border rounded-2xl bg-slate-50/50">
                       {classOptions.map(cls => (
                         <div key={cls.value} className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={selectedClasses.includes(cls.value)}
                              onChange={(e) => {
                                if(e.target.checked) setSelectedClasses([...selectedClasses, cls.value]);
                                else setSelectedClasses(selectedClasses.filter(v => v !== cls.value));
                              }}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                            />
                            <span className="text-xs font-bold text-slate-600">{cls.label}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Multi-Teachers assignment logic could go here, simplifying to first teacher for select */}
                 <CustomSelect 
                    control={control}
                    name="teacher"
                    label="Lead Instructor"
                    placeholder="Assign a lead..."
                    options={teacherOptions}
                 />

                 <DialogFooter className="mt-8">
                   <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-xl uppercase tracking-widest">
                      {editingSubject ? "Synchronize" : "Authorize Registry"}
                   </Button>
                 </DialogFooter>
               </form>
             </DialogContent>
           </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 animate-pulse">
           <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
           <p className="text-sm font-bold text-slate-400 italic italic">Indexing Knowledge Base...</p>
        </div>
      ) : (
        <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-white/5">
                <TableRow className="border-none">
                  <TableHead className="pl-10 h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Knowledge Code</TableHead>
                  <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Subject Identity</TableHead>
                  <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Faculty & Distribution</TableHead>
                  <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Academic Weight</TableHead>
                  <TableHead className="pr-10 h-16 text-right font-black text-[10px] uppercase tracking-widest text-slate-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.map((subj) => (
                  <TableRow key={subj._id} className="hover:bg-slate-50/50 transition-colors border-slate-50 dark:border-white/5 group">
                    <TableCell className="pl-10 py-6">
                       <Badge variant="outline" className="bg-slate-900 text-white border-none font-black tracking-tighter text-xs px-3 py-1 rounded-lg">
                          {subj.code}
                       </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <span className="font-black text-slate-900 dark:text-white text-lg tracking-tight">{subj.name}</span>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{subj.category}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                             <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                             <span className="text-sm font-bold text-slate-600">{subj.teacher?.[0]?.name || "Unassigned"}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                             {subj.assignedClasses?.map(cls => (
                               <Badge key={cls._id} variant="secondary" className="text-[8px] font-bold h-4 bg-slate-100 dark:bg-white/5 text-slate-500 border-none uppercase">
                                  {cls.name}
                               </Badge>
                             ))}
                          </div>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2 font-black text-slate-900">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span>{subj.credits} Credits</span>
                       </div>
                    </TableCell>
                    <TableCell className="pr-10 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(subj)} className="h-10 w-10 rounded-xl hover:bg-slate-100">
                             <Edit2 className="h-4 w-4 text-slate-400" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(subj._id)} className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-600 text-slate-400">
                             <Trash2 className="h-4 w-4" />
                          </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {!loading && subjects.length === 0 && (
        <div className="h-96 border-2 border-dashed rounded-[3.5rem] border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50 bg-white shadow-inner animate-in zoom-in duration-1000">
           <BookOpen className="h-24 w-24 stroke-[1]" />
           <p className="font-black text-2xl italic tracking-tight uppercase">Curriculum Empty. Please Authorize Registry.</p>
        </div>
      )}
    </div>
  );
};

export default SubjectManagement;
