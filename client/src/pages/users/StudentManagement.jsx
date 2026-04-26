import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  Users, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  UserPlus, 
  GraduationCap, 
  Phone, 
  Mail,
  Loader2,
  ShieldCheck
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

import { useNavigate } from "react-router-dom";

const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contact: "",
      grNumber: "",
      parentName: "",
      parentPhone: "",
      address: "",
      classId: "",
    }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentRes, classRes] = await Promise.all([
        api.get("/students"),
        api.get("/classes")
      ]);
      setStudents(studentRes.data || []);
      setClasses(classRes.data || []);
    } catch (error) {
      toast.error("Failed to synchronize student registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent._id}`, data);
        toast.success("Student profile successfully updated");
      } else {
        await api.post("/students/enroll", data);
        toast.success("Student successfully enrolled in the academy");
      }
      setIsDialogOpen(false);
      setEditingStudent(null);
      reset();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    reset({
      name: student.user?.name,
      email: student.user?.email,
      contact: student.user?.contact || "",
      grNumber: student.grNumber,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      address: student.address,
      classId: student.user?.studentClass?._id || student.user?.studentClass || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to decommission this student profile?")) return;
    try {
      await api.delete(`/students/${id}`);
      toast.success("Student record successfully removed");
      fetchData();
    } catch (error) {
      toast.error("Deletion restricted");
    }
  };

  const filteredStudents = students.filter(s => 
    s.grNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const classOptions = Array.isArray(classes) ? classes.map(c => ({ label: c.name, value: c._id })) : [];

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-600 border-blue-100 uppercase tracking-widest text-[10px] font-black italic">Academy Registry</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Student Management</h1>
          <p className="text-muted-foreground font-medium italic">Managing academic cohorts and institutional enrollment.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search GR Number or Name..." 
                className="pl-10 h-11 rounded-xl bg-white border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Dialog open={isDialogOpen} onOpenChange={(open) => {
             setIsDialogOpen(open);
             if(!open) { setEditingStudent(null); reset(); }
           }}>
             <DialogTrigger asChild>
               <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
                 <UserPlus className="h-5 w-5 mr-2" /> Enroll Student
               </Button>
             </DialogTrigger>
             <DialogContent className="max-w-2xl rounded-[2.5rem] p-8 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
               <DialogHeader className="mb-4">
                 <DialogTitle className="text-2xl font-black italic uppercase">{editingStudent ? "Edit Student Profile" : "Student Enrollment"}</DialogTitle>
                 <DialogDescription className="font-medium italic">{editingStudent ? "Update academic metadata and residential credentials." : "Initialize a new academic profile within the institutional registry."}</DialogDescription>
               </DialogHeader>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                 {/* Personal Info */}
                 <div className="grid grid-cols-2 gap-4">
                    <CustomInput control={control} name="name" label="Student Name" placeholder="Full Name" rules={{required: true}} />
                    <CustomInput control={control} name="email" label="Academic Email" placeholder="email@school.com" rules={{required: true}} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {!editingStudent && <CustomInput control={control} name="password" label="Temporary Password" type="password" placeholder="********" rules={{required: true}} />}
                    <CustomInput control={control} name="contact" label="Contact Number" placeholder="+1..." />
                 </div>

                 {/* Academic Info */}
                 <div className="bg-slate-50/50 p-6 rounded-3xl space-y-4 border border-slate-100">
                    <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2">
                       <ShieldCheck className="h-3 w-3" /> Institutional Metadata
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                       <CustomInput control={control} name="grNumber" label="GR Number (Unique)" placeholder="e.g. 10293" rules={{required: true}} />
                       <CustomSelect control={control} name="classId" label="Assigned Cohort" options={classOptions} />
                    </div>
                 </div>

                 {/* Guardian Info */}
                 <div className="bg-slate-50/50 p-6 rounded-3xl space-y-4 border border-slate-100">
                    <h4 className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2">
                       <Users className="h-3 w-3" /> Guardian Registry
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                       <CustomInput control={control} name="parentName" label="Parent/Guardian Name" placeholder="Guardian Name" rules={{required: true}} />
                       <CustomInput control={control} name="parentPhone" label="Guardian Contact" placeholder="Emergency Contact" rules={{required: true}} />
                    </div>
                    <CustomInput control={control} name="address" label="Residential Address" placeholder="Full Address" rules={{required: true}} />
                 </div>

                 <DialogFooter className="mt-8">
                   <Button type="submit" className="w-full h-12 bg-slate-900 text-white rounded-2xl font-black shadow-xl uppercase tracking-widest">
                      {editingStudent ? "Synchronize Changes" : "Authorize Enrollment"}
                   </Button>
                 </DialogFooter>
               </form>
             </DialogContent>
           </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 animate-pulse">
           <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
           <p className="text-sm font-bold text-slate-400 italic">Formatting Student Registry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
           <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden">
             <Table>
               <TableHeader className="bg-slate-50/50 dark:bg-white/5">
                 <TableRow className="border-none">
                   <TableHead className="pl-10 h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Institutional ID (GR)</TableHead>
                   <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Student Identity</TableHead>
                   <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Academic Cohort</TableHead>
                   <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Guardian Intel</TableHead>
                   <TableHead className="pr-10 h-16 text-right"></TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredStudents.map((student) => (
                   <TableRow key={student._id} className="hover:bg-slate-50/80 transition-colors border-slate-50 dark:border-white/5 group">
                     <TableCell className="pl-10 py-6">
                        <Badge variant="secondary" className="bg-blue-600 text-white border-none font-black italic tracking-tighter px-3">
                           {student.grNumber}
                        </Badge>
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white font-black text-xs uppercase">
                              {student.user?.name.charAt(0)}
                           </div>
                           <div className="flex flex-col">
                              <span className="font-black text-slate-800 dark:text-white text-lg tracking-tight">{student.user?.name}</span>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                                 <Mail className="h-3 w-3" />
                                 {student.user?.email}
                              </div>
                           </div>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-2 font-black text-slate-600 italic">
                           <GraduationCap className="h-4 w-4 text-blue-400" />
                           {student.user?.studentClass?.name || "Unassigned"}
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex flex-col gap-1">
                           <span className="font-bold text-slate-700 dark:text-slate-300">{student.parentName}</span>
                           <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                              <Phone className="h-3 w-3" />
                              {student.parentPhone}
                           </div>
                        </div>
                     </TableCell>
                     <TableCell className="pr-10 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
                              <MoreVertical className="h-5 w-5 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[180px]">
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/students/${student.user?._id || student.user}`)} className="rounded-xl py-3 cursor-pointer text-indigo-600 focus:bg-indigo-50">
                              <Users className="h-4 w-4 mr-2" /> <span className="font-bold">View Full Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(student)} className="rounded-xl py-3 cursor-pointer">
                              <Edit2 className="h-4 w-4 mr-2" /> <span className="font-bold">Modify Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(student._id)} className="rounded-xl py-3 cursor-pointer text-rose-600 focus:text-rose-600">
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

      {!loading && students.length === 0 && (
        <div className="h-96 border-2 border-dashed rounded-[3.5rem] border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50 bg-white shadow-inner">
           <Users className="h-20 w-20 stroke-[1.5]" />
           <p className="font-black text-2xl italic tracking-tight uppercase">No Students in Registry</p>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
