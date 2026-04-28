import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  Users, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  UserPlus, 
  Mail,
  Loader2,
  User,
  LayoutGrid,
  Hash,
  Phone,
  Shield,
  MapPin,
  KeyRound,
  Fingerprint,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClassId, setFilterClassId] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
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
      setClasses(classRes.data?.classes || classRes.data || []);
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
      setSaving(true);
      await api.post("/students/enroll", data);
      toast.success("Student successfully enrolled in the academy");
      reset({
        name: "",
        email: "",
        password: "",
        contact: "",
        grNumber: "",
        parentName: "",
        parentPhone: "",
        address: "",
        classId: data.classId, // retain class for convenience
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    } finally {
      setSaving(false);
    }
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

  const processedStudents = !filterClassId ? [] : students
    .filter(s => {
      const sClassId = typeof s.user?.studentClass === 'object' ? s.user?.studentClass?._id : s.user?.studentClass;
      return sClassId === filterClassId;
    })
    .filter(s => 
      s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.grNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const classA = a.user?.studentClass?.name || "Unassigned";
      const classB = b.user?.studentClass?.name || "Unassigned";
      if (classA !== classB) return classA.localeCompare(classB);
      return (a.rollNo || 0) - (b.rollNo || 0);
    });

  return (
    <div className="bg-slate-50 min-h-screen p-6 lg:p-10 font-geist animate-in fade-in duration-700">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-1">
            <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[10px] font-black italic">Academy Registry</Badge>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Student Management</h1>
            <p className="text-muted-foreground font-medium italic">Smart auto-incrementing enrollment and metadata management.</p>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <Card className="xl:col-span-4 rounded-[2rem] border-none shadow-xl bg-white overflow-hidden relative sticky top-6">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-violet-500" />
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-xl font-black italic flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-500" /> 
                Enroll Student
              </CardTitle>
              <CardDescription className="text-xs font-medium text-slate-500">
                Register a new profile. Roll No is auto-calculated.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-1.5"><User className="h-3 w-3" /> Full Name</label>
                    <Input {...register("name", { required: true })} placeholder="Student Name" className="h-10 rounded-xl bg-slate-50/50" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-1.5"><Mail className="h-3 w-3" /> Email</label>
                    <Input {...register("email", { required: true })} type="email" placeholder="student@academy.edu" className="h-10 rounded-xl bg-slate-50/50" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-1.5"><KeyRound className="h-3 w-3" /> Password</label>
                      <Input {...register("password", { required: true })} type="password" placeholder="••••••••" className="h-10 rounded-xl bg-slate-50/50" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-1.5"><Phone className="h-3 w-3" /> Contact</label>
                      <Input {...register("contact")} placeholder="+1..." className="h-10 rounded-xl bg-slate-50/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-1.5"><LayoutGrid className="h-3 w-3" /> Class</label>
                      <select {...register("classId", { required: true })} className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/50 font-medium text-xs focus:ring-2 focus:ring-indigo-500">
                        <option value="" disabled>Select Cohort</option>
                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5"><Hash className="h-3 w-3" /> Roll No</label>
                      <Input disabled placeholder="Auto-Assign" className="h-10 rounded-xl bg-slate-100 font-bold text-slate-400 cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-1.5"><Fingerprint className="h-3 w-3" /> GR Number</label>
                        <Input {...register("grNumber", { required: true })} placeholder="GR-1029" className="h-10 rounded-xl bg-slate-50/50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-1.5"><Shield className="h-3 w-3" /> Parent</label>
                        <Input {...register("parentName", { required: true })} placeholder="Guardian Name" className="h-10 rounded-xl bg-slate-50/50" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-1.5"><Phone className="h-3 w-3" /> Guardian Ph</label>
                        <Input {...register("parentPhone", { required: true })} placeholder="Phone" className="h-10 rounded-xl bg-slate-50/50" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Address</label>
                        <Input {...register("address", { required: true })} placeholder="Address" className="h-10 rounded-xl bg-slate-50/50" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button type="submit" disabled={saving} className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-200 uppercase tracking-widest">
                    {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <UserPlus className="h-5 w-5 mr-2" />} Enroll
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right Column: Table */}
          <div className="xl:col-span-8 space-y-4">
            
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-100">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 sm:w-56">
                  <select 
                    value={filterClassId}
                    onChange={(e) => setFilterClassId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-300 transition-colors"
                  >
                    <option value="" disabled>Select Class</option>
                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search enrolled students..." 
                  className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={!filterClassId}
                />
              </div>
            </div>

            <Card className="rounded-[2rem] border-none shadow-md bg-white overflow-hidden">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="h-96 flex flex-col items-center justify-center gap-4 animate-pulse">
                     <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
                     <p className="text-sm font-bold text-slate-400 italic">Syncing Database...</p>
                  </div>
                ) : !filterClassId ? (
                  <div className="h-96 flex flex-col items-center justify-center gap-4 text-center p-6">
                     <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                       <BookOpen className="h-10 w-10 text-slate-300" />
                     </div>
                     <p className="text-lg font-black text-slate-500 uppercase tracking-widest">Awaiting Selection</p>
                     <p className="text-sm font-bold text-slate-400">Please select a class to view students</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-slate-50/80">
                      <TableRow className="border-slate-100">
                        <TableHead className="pl-6 h-14 w-[100px] font-black text-[10px] uppercase tracking-widest text-slate-500 text-center">Roll No</TableHead>
                        <TableHead className="h-14 font-black text-[10px] uppercase tracking-widest text-slate-500">Identity</TableHead>
                        <TableHead className="h-14 font-black text-[10px] uppercase tracking-widest text-slate-500">Class</TableHead>
                        <TableHead className="pr-6 h-14 text-right font-black text-[10px] uppercase tracking-widest text-slate-500">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processedStudents.map((student) => (
                        <TableRow key={student._id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                          <TableCell className="pl-6 py-4 text-center">
                             <Badge variant="outline" className="bg-white border-slate-200 text-indigo-600 font-black tracking-widest shadow-sm">
                               {student.rollNo ? String(student.rollNo).padStart(2, '0') : '--'}
                             </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                               <span className="font-black text-slate-800 text-sm">{student.user?.name}</span>
                               <span className="text-[10px] font-medium text-slate-400">{student.user?.email}</span>
                               <span className="text-[10px] font-medium text-slate-400">GR: {student.grNumber}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                             <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 font-medium px-3 py-1 rounded-full text-xs border-none hover:bg-indigo-100">
                               {student.user?.studentClass?.name || "Unassigned"}
                             </Badge>
                          </TableCell>
                          <TableCell className="pr-6 text-right">
                             <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100">
                                   <MoreVertical className="h-4 w-4 text-slate-400" />
                                 </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl p-2 min-w-[160px]">
                                 <DropdownMenuItem onClick={() => navigate(`/dashboard/students/${student.user?._id || student.user}`)} className="rounded-lg py-2.5 cursor-pointer text-indigo-600 focus:bg-indigo-50">
                                   <Users className="h-4 w-4 mr-2" /> <span className="font-bold text-xs">View Profile</span>
                                 </DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => handleDelete(student._id)} className="rounded-lg py-2.5 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                                   <Trash2 className="h-4 w-4 mr-2" /> <span className="font-bold text-xs">Decommission</span>
                                 </DropdownMenuItem>
                               </DropdownMenuContent>
                             </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {processedStudents.length === 0 && (
                        <TableRow>
                           <TableCell colSpan={4} className="h-64 text-center">
                              <div className="flex flex-col items-center justify-center space-y-2">
                                 <Users className="h-10 w-10 text-slate-200" />
                                 <p className="font-bold text-slate-400 text-sm">No registry entries found.</p>
                              </div>
                           </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
