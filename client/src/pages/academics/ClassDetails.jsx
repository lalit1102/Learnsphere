import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { 
  Users, 
  ChevronLeft, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  BadgeCheck,
  Search,
  ArrowRight,
  GraduationCap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classInfo, setClassInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Class Info
      const classRes = await api.get(`/classes/${id}`);
      setClassInfo(classRes.data.class || classRes.data);
      
      // Fetch Students for this class
      const studentRes = await api.get(`/users?role=student&studentClass=${id}`);
      setStudents(studentRes.data.users || []);
    } catch (error) {
      console.error("Critical Failure fetching cohort details:", error);
      toast.error("Failed to load class details");
      navigate("/academics/classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Syncing Student Registry...</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/academics/classes")}
            className="p-0 hover:bg-transparent text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 mb-2 font-bold text-xs uppercase tracking-widest"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Cohorts
          </Button>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-4">
            {classInfo?.name} <span className="text-slate-200 dark:text-white/10 font-thin">|</span> Student Registry
          </h1>
          <p className="text-muted-foreground font-medium italic flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-500" /> {classInfo?.roomNumber || "Main Wing"} • Assigned Mentor: {classInfo?.classTeacher?.name || "Unassigned"}
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-10 h-12 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="rounded-[2.5rem] border-none shadow-xl bg-indigo-600 text-white p-8">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Enrollment</p>
                  <p className="text-4xl font-black italic">{students.length}</p>
               </div>
               <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Users className="w-7 h-7" />
               </div>
            </div>
         </Card>
         <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance Status</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white italic">94.2% Avg.</p>
         </Card>
         <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 flex flex-col justify-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Assessment</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white italic">Unit Test • May 12</p>
         </Card>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <Card key={student._id} className="rounded-[2.5rem] border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-900 group overflow-hidden border border-transparent hover:border-indigo-100 dark:hover:border-white/10">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500">
                    <GraduationCap className="w-8 h-8 text-indigo-500" />
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight line-clamp-1 italic">{student.name}</h3>
                    <Badge variant="outline" className="w-fit h-4 text-[8px] font-black uppercase tracking-tighter bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 border-none">
                       {student.studentID || "STU-2024-001"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{student.phone || "+91 98765 43210"}</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <Button 
                    onClick={() => navigate(`/dashboard/students/${student._id}`)}
                    variant="outline" 
                    className="flex-1 h-11 rounded-xl border-slate-100 dark:border-white/5 font-bold text-xs hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-600 dark:text-slate-400 hover:text-indigo-600"
                  >
                     View Profile
                  </Button>
                  <Button className="h-11 w-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center p-0 transition-all active:scale-90">
                     <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full h-64 border-2 border-dashed rounded-[3.5rem] border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50 bg-white dark:bg-white/5">
             <Users className="h-16 w-16 stroke-[1]" />
             <p className="font-black text-xl italic tracking-tight uppercase">No Students synchronized for this filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetails;
