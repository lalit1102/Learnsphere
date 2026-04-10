import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  School, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Users, 
  Home, 
  Binary,
  GraduationCap,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { CustomInput } from "@/components/global/CustomInput";
import { CustomSelect } from "@/components/global/CustomSelect";
import { useForm } from "react-hook-form";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      roomNumber: "",
      capacity: 40,
      classTeacher: "",
    }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classRes, teacherRes] = await Promise.all([
        api.get("/classes"),
        api.get("/users?role=teacher")
      ]);
      
      // The backend /classes now returns a direct array, but we safeguard it
      const classData = Array.isArray(classRes.data) ? classRes.data : (classRes.data?.classes || []);
      setClasses(classData);
      
      // Backend /users returns { success: true, users: [...] }
      setTeachers(teacherRes.data?.users || []);
    } catch (error) {
      toast.error("Failed to synchronize academic data");
      setClasses([]); // Ensure state is always an array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingClass) {
        await api.put(`/classes/${editingClass._id}`, data);
        toast.success("Institutional cohort updated");
      } else {
        await api.post("/classes", data);
        toast.success("New academic class established");
      }
      setIsDialogOpen(false);
      setEditingClass(null);
      reset();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to decommission this class?")) return;
    try {
      await api.delete(`/classes/${id}`);
      toast.success("Class successfully removed from registry");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Deletion restricted");
    }
  };

  const openEditDialog = (cls) => {
    setEditingClass(cls);
    reset({
      name: cls.name,
      roomNumber: cls.roomNumber || "",
      capacity: cls.capacity,
      classTeacher: cls.classTeacher?._id || "",
    });
    setIsDialogOpen(true);
  };

  const filteredClasses = Array.isArray(classes) ? classes.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const teacherOptions = teachers.map(t => ({ label: t.name, value: t._id }));

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[10px] font-black italic">Academy Core</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Class Management</h1>
          <p className="text-muted-foreground font-medium italic">Architecting school cohorts and spatial distribution.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search Class ID..." 
                className="pl-10 h-11 rounded-xl bg-white border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Dialog open={isDialogOpen} onOpenChange={(open) => {
             setIsDialogOpen(open);
             if(!open) { setEditingClass(null); reset(); }
           }}>
             <DialogTrigger asChild>
               <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">
                 <Plus className="h-5 w-5 mr-2" /> New Class
               </Button>
             </DialogTrigger>
             <DialogContent className="max-w-md rounded-3xl p-8 border-none shadow-2xl">
               <DialogHeader className="mb-4">
                 <DialogTitle className="text-2xl font-black">{editingClass ? "Edit Cohort" : "Initialize Class"}</DialogTitle>
                 <DialogDescription className="font-medium italic">Define the structural parameters for this academic group.</DialogDescription>
               </DialogHeader>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                 <CustomInput 
                   control={control} 
                   name="name" 
                   label="Class Name" 
                   placeholder="e.g. 10-A" 
                   rules={{ required: "Class name is essential" }}
                 />
                 <div className="grid grid-cols-2 gap-4">
                   <CustomInput 
                     control={control} 
                     name="roomNumber" 
                     label="Room Number" 
                     placeholder="e.g. R-204" 
                   />
                   <CustomInput 
                     control={control} 
                     name="capacity" 
                     label="Capacity" 
                     type="number"
                     placeholder="40" 
                   />
                 </div>
                 <CustomSelect 
                    control={control}
                    name="classTeacher"
                    label="Class Teacher"
                    placeholder="Assign a mentor..."
                    options={teacherOptions}
                 />
                 <DialogFooter className="mt-8">
                   <Button type="submit" className="w-full h-12 bg-slate-900 text-white rounded-2xl font-black shadow-xl">
                      {editingClass ? "Update Registry" : "Authorize Creation"}
                   </Button>
                 </DialogFooter>
               </form>
             </DialogContent>
           </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 animate-pulse">
           <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
           <p className="text-sm font-bold text-slate-400 italic">Formatting Registry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
           <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden">
             <Table>
               <TableHeader className="bg-slate-50/50 dark:bg-white/5">
                 <TableRow className="border-none">
                   <TableHead className="pl-10 h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Class Signature</TableHead>
                   <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Location (Room)</TableHead>
                   <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Class Mentor</TableHead>
                   <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Occupancy</TableHead>
                   <TableHead className="pr-10 h-16 text-right"></TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredClasses.map((cls) => (
                   <TableRow key={cls._id} className="hover:bg-slate-50/80 transition-colors border-slate-50 dark:border-white/5 group">
                     <TableCell className="pl-10 py-6">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-black text-xs">
                              {cls.name.charAt(0)}
                           </div>
                           <div className="flex flex-col">
                              <span className="font-black text-slate-800 dark:text-white text-lg">{cls.name}</span>
                              <Badge variant="outline" className="w-fit text-[9px] h-4 font-bold uppercase border-slate-200 text-slate-400">{cls.academicYear?.name || "Global"}</Badge>
                           </div>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-2 font-bold text-slate-500">
                           <Home className="h-3.5 w-3.5" />
                           {cls.roomNumber || "Unassigned"}
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex flex-col">
                           <span className="font-bold text-slate-700 dark:text-slate-300">{cls.classTeacher?.name || "Vacant"}</span>
                           <span className="text-[10px] font-medium text-slate-400">{cls.classTeacher?.email || "No Mentor"}</span>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-3">
                           <div className="flex-1 h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden max-w-[100px]">
                              <div 
                                className="h-full bg-indigo-500 rounded-full" 
                                style={{ width: `${(cls.students?.length / cls.capacity) * 100}%` }}
                              />
                           </div>
                           <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">
                              {cls.students?.length} / {cls.capacity}
                           </span>
                        </div>
                     </TableCell>
                     <TableCell className="pr-10 text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
                             <MoreVertical className="h-5 w-5 text-slate-400" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[160px]">
                           <DropdownMenuItem onClick={() => openEditDialog(cls)} className="rounded-xl py-3 cursor-pointer">
                             <Edit2 className="h-4 w-4 mr-2" /> <span className="font-bold">Modify Registry</span>
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => handleDelete(cls._id)} className="rounded-xl py-3 cursor-pointer text-rose-600 focus:text-rose-600">
                             <Trash2 className="h-4 w-4 mr-2" /> <span className="font-bold">Decommission</span>
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </Card>
        </div>
      )}

      {!loading && classes.length === 0 && (
        <div className="h-96 border-2 border-dashed rounded-[3.5rem] border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50 bg-white shadow-inner">
           <School className="h-20 w-20 stroke-[1.5]" />
           <p className="font-black text-2xl italic tracking-tight uppercase">No Institutional Cohorts Found</p>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
