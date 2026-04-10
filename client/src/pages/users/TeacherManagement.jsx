import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  UserPlus, 
  BookOpen, 
  Mail,
  Phone,
  Briefcase,
  Award,
  Loader2,
  ShieldCheck,
  Star
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

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contact: "",
      teacherId: "",
      specialization: "",
      yearsOfExperience: 0,
      bio: "",
      subjects: []
    }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teacherRes, subjectRes] = await Promise.all([
        api.get("/teachers"),
        api.get("/subjects")
      ]);
      setTeachers(teacherRes.data || []);
      setSubjects(subjectRes.data || []);
    } catch (error) {
      toast.error("Failed to synchronize faculty registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post("/teachers/enroll", data);
      toast.success("Faculty member successfully appointed");
      setIsDialogOpen(false);
      reset();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Appointment failed");
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.teacherDetails?.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.teacherDetails?.teacherId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-widest text-[10px] font-black italic">Collegiate Registry</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Faculty Management</h1>
          <p className="text-muted-foreground font-medium italic">Coordinating institutional expertise and pedagogical delivery.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search ID, Name or Specialization..." 
                className="pl-10 h-11 rounded-xl bg-white border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
             <DialogTrigger asChild>
               <Button className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95">
                 <UserPlus className="h-5 w-5 mr-2" /> Appoint Teacher
               </Button>
             </DialogTrigger>
             <DialogContent className="max-w-2xl rounded-[2.5rem] p-8 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
               <DialogHeader className="mb-4">
                 <DialogTitle className="text-2xl font-black italic uppercase">Faculty Appointment</DialogTitle>
                 <DialogDescription className="font-medium italic">Enroll a new pedagogical expert into the academic ledger.</DialogDescription>
               </DialogHeader>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                 {/* Identity Info */}
                 <div className="grid grid-cols-2 gap-4">
                    <CustomInput control={control} name="name" label="Full Identity" placeholder="Professional Name" rules={{required: true}} />
                    <CustomInput control={control} name="email" label="Institutional Email" placeholder="faculty@school.com" rules={{required: true}} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <CustomInput control={control} name="password" label="Portal Password" type="password" placeholder="********" rules={{required: true}} />
                    <CustomInput control={control} name="contact" label="Direct Contact" placeholder="+1..." />
                 </div>

                 {/* Professional Metadata */}
                 <div className="bg-slate-50/50 p-6 rounded-3xl space-y-4 border border-slate-100">
                    <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2">
                       <Award className="h-3 w-3" /> Professional Intel
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                       <CustomInput control={control} name="teacherId" label="Faculty ID (Unique)" placeholder="T-001" rules={{required: true}} />
                       <CustomInput control={control} name="specialization" label="Core Specialization" placeholder="e.g. Theoretical Physics" />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                       <CustomInput control={control} name="yearsOfExperience" label="Years of Expertise" type="number" placeholder="5" />
                       <CustomInput control={control} name="bio" label="Professional Narrative (Bio)" placeholder="A brief overview of pedagogical background..." />
                    </div>
                 </div>

                 <DialogFooter className="mt-8">
                   <Button type="submit" className="w-full h-12 bg-slate-900 text-white rounded-2xl font-black shadow-xl uppercase tracking-widest">
                      Finalize Appointment
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
           <p className="text-sm font-bold text-slate-400 italic">Formatting Faculty Registry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
           <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden">
             <Table>
               <TableHeader className="bg-slate-50/50 dark:bg-white/5">
                 <TableRow className="border-none">
                   <TableHead className="pl-10 h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Faculty ID</TableHead>
                   <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Identity</TableHead>
                   <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Specialization</TableHead>
                   <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Experience</TableHead>
                   <TableHead className="pr-10 h-16 text-right"></TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredTeachers.map((teacher) => (
                   <TableRow key={teacher._id} className="hover:bg-slate-50/80 transition-colors border-slate-50 dark:border-white/5 group">
                     <TableCell className="pl-10 py-6">
                        <Badge variant="secondary" className="bg-emerald-600 text-white border-none font-black italic tracking-tighter px-3">
                           {teacher.teacherDetails?.teacherId || "N/A"}
                        </Badge>
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white font-black text-xs uppercase">
                              {teacher.name.charAt(0)}
                           </div>
                           <div className="flex flex-col">
                              <span className="font-black text-slate-800 dark:text-white text-lg tracking-tight">{teacher.name}</span>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                                 <Mail className="h-3 w-3" />
                                 {teacher.email}
                              </div>
                           </div>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-emerald-50 text-emerald-700 border-none font-bold text-xs w-fit">
                           <Briefcase className="h-3 w-3" />
                           {teacher.teacherDetails?.specialization || "General Faculty"}
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-2 font-black text-slate-600 italic">
                           <Star className="h-4 w-4 text-amber-400" />
                           {teacher.teacherDetails?.yearsOfExperience || 0} Years
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
                            <DropdownMenuItem className="rounded-xl py-3 cursor-pointer">
                              <Edit2 className="h-4 w-4 mr-2" /> <span className="font-bold">Modify Status</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-3 cursor-pointer text-rose-600 focus:text-rose-600">
                              <Trash2 className="h-4 w-4 mr-2" /> <span className="font-bold">Revoke Access</span>
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

      {!loading && teachers.length === 0 && (
        <div className="h-96 border-2 border-dashed rounded-[3.5rem] border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50 bg-white shadow-inner">
           <Users className="h-20 w-20 stroke-[1.5]" />
           <p className="font-black text-2xl italic tracking-tight uppercase">Faculty Registry Unpopulated</p>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
