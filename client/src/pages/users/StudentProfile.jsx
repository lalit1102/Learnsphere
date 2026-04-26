import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  MessageSquare, 
  ChevronLeft, 
  Loader2,
  GraduationCap,
  Activity,
  Award,
  History,
  MoreVertical,
  UserCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Student Data
      const studentRes = await api.get(`/users/${id}`);
      const studentData = studentRes.data.user || studentRes.data;
      setStudent(studentData);

      // Try to fetch parent if email exists
      if (studentData.studentDetails?.parentEmail) {
        try {
          const parentRes = await api.get(`/users?role=parent&email=${studentData.studentDetails.parentEmail}`);
          if (parentRes.data.users?.length > 0) {
            setParent(parentRes.data.users[0]);
          }
        } catch (err) {
          console.warn("Parent data lookup failed");
        }
      }
    } catch (error) {
      toast.error("Failed to load student profile");
      navigate("/academics/classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Authenticating Profile Registry...</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-10 max-w-[1400px] mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Breadcrumb & Global Actions */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="p-0 hover:bg-transparent text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Registry
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-10 px-4 text-xs font-bold border-slate-200">Print Portfolio</Button>
          <Button className="rounded-2xl h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-95">Edit Profile</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Basic Details & Identity */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-slate-900 group">
              <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-20">
                    <GraduationCap className="w-24 h-24 text-white rotate-12" />
                 </div>
              </div>
              <CardContent className="px-8 pb-8 -mt-16 relative">
                 <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-32 w-32 rounded-[2.5rem] bg-white dark:bg-slate-800 p-2 shadow-2xl shadow-indigo-100 group-hover:scale-105 transition-transform duration-500 relative">
                       <div className="h-full w-full rounded-[2rem] bg-slate-50 dark:bg-slate-900 flex items-center justify-center border-4 border-indigo-50/50 dark:border-indigo-500/10 overflow-hidden">
                          {student?.profileImage ? (
                            <img src={student.profileImage} alt={student.name} className="h-full w-full object-cover" />
                          ) : (
                            <UserIcon className="h-12 w-12 text-slate-300" />
                          )}
                       </div>
                       <div className="absolute bottom-1 right-1 h-8 w-8 bg-emerald-500 rounded-2xl border-4 border-white dark:border-slate-800 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 text-white" />
                       </div>
                    </div>
                    
                    <div className="space-y-1">
                       <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight italic">{student?.name}</h2>
                       <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest flex items-center justify-center gap-2">
                          {student?.studentClass?.name || "Grade 10-A"} <span className="h-1 w-1 bg-slate-300 rounded-full" /> {student?.studentDetails?.grNumber || "STU-2024-001"}
                       </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                       <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">Active Enrollment</Badge>
                       <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">A+ Performer</Badge>
                    </div>
                 </div>

                 <div className="mt-10 space-y-5 pt-8 border-t border-slate-50 dark:border-white/5">
                    <div className="flex items-center gap-4 group/item">
                       <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover/item:text-indigo-500 transition-colors">
                          <Mail className="w-4 h-4" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Digital Mail</span>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{student?.email}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 group/item">
                       <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover/item:text-indigo-500 transition-colors">
                          <Phone className="w-4 h-4" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Contact</span>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{student?.contact || "+91 98765 43210"}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 group/item">
                       <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover/item:text-indigo-500 transition-colors">
                          <Calendar className="w-4 h-4" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Onboarding Date</span>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">June 14, 2024</span>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="rounded-[3rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-black italic tracking-tight text-slate-900 dark:text-white uppercase">Key Performance</h3>
                 <Award className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <span>GPA Matrix</span>
                       <span className="text-indigo-600">3.8 / 4.0</span>
                    </div>
                    <div className="h-2 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 rounded-full w-[95%]" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <span>Syllabus Progress</span>
                       <span className="text-emerald-600">82%</span>
                    </div>
                    <div className="h-2 bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full w-[82%]" />
                    </div>
                 </div>
              </div>
           </Card>
        </div>

        {/* Right Column: Guardian, Attendance & Remarks */}
        <div className="lg:col-span-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Guardian Info */}
              <Card className="rounded-[3rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 flex flex-col h-full overflow-hidden group">
                 <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                       <h3 className="text-lg font-black italic tracking-tight text-slate-900 dark:text-white uppercase">Guardian Registry</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Emergency Contact Primary</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                       <UserCheck className="w-5 h-5" />
                    </div>
                 </div>

                 <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-5">
                       <div className="h-16 w-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-black text-xl">
                          {parent?.name?.charAt(0) || "P"}
                       </div>
                       <div className="flex flex-col">
                          <span className="font-black text-slate-900 dark:text-white text-lg leading-tight">{parent?.name || "Institutional Guardian"}</span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Relationship: {parent ? "Parent" : "Unverified"}</span>
                       </div>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                       <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Email Identity</span>
                          <span className="text-slate-700 dark:text-slate-300 font-black italic">{student?.studentDetails?.parentEmail || "no-guardian@academy.com"}</span>
                       </div>
                       <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Secondary Phone</span>
                          <span className="text-slate-700 dark:text-slate-300 font-black italic">+91 00000 00000</span>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8">
                    <Button className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all">
                       <MessageSquare className="w-4 h-4" /> Send Message to Parent
                    </Button>
                 </div>
              </Card>

              {/* Attendance Stats */}
              <Card className="rounded-[3rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 flex flex-col h-full group">
                 <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                       <h3 className="text-lg font-black italic tracking-tight text-slate-900 dark:text-white uppercase">Temporal Presence</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Attendance Metrics Summary</p>
                    </div>
                    <Activity className="w-6 h-6 text-emerald-500 animate-pulse" />
                 </div>

                 <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                    <div className="relative h-32 w-32 flex items-center justify-center">
                       <svg className="h-full w-full -rotate-90">
                          <circle cx="64" cy="64" r="58" className="fill-none stroke-slate-50 dark:stroke-white/5 stroke-[8]" />
                          <circle cx="64" cy="64" r="58" className="fill-none stroke-indigo-500 stroke-[8] transition-all duration-1000" strokeDasharray="364.4" strokeDashoffset="21.8" strokeLinecap="round" />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tight">94%</span>
                          <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Current Avg</span>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 w-full gap-4 pt-4">
                       <div className="text-center p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Days Present</p>
                          <p className="text-lg font-black text-slate-900 dark:text-white italic">142</p>
                       </div>
                       <div className="text-center p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
                          <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Days Absent</p>
                          <p className="text-lg font-black text-slate-900 dark:text-white italic">8</p>
                       </div>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Past Remarks Section */}
           <Card className="rounded-[3rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-8">
              <div className="flex items-center justify-between border-b border-slate-50 dark:border-white/5 pb-6">
                 <div className="space-y-1">
                    <h3 className="text-lg font-black italic tracking-tight text-slate-900 dark:text-white uppercase flex items-center gap-2">
                       <History className="w-5 h-5 text-indigo-500" /> Behavioral & Academic Remarks
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Collective faculty observation log</p>
                 </div>
                 <Button variant="outline" size="sm" className="rounded-xl font-bold text-[10px] h-8 px-4 border-slate-200">Export Logs</Button>
              </div>

              <div className="space-y-6">
                 {[
                   { teacher: "Prof. Paresh", date: "April 12, 2024", type: "Academic", remark: "Exceptional performance in the Advanced Calculus module. Demonstrates high conceptual clarity and rapid problem-solving skills.", sentiment: "positive" },
                   { teacher: "Ms. Anjali", date: "March 28, 2024", type: "Behavioral", remark: "Active participant in school council meetings. Displays natural leadership and collaborative spirit during group activities.", sentiment: "positive" },
                   { teacher: "Mr. Rajesh", date: "March 15, 2024", type: "Discipline", remark: "Slight delay in assignment submission for 'Digital Electronics'. However, the quality of work remains consistently high.", sentiment: "neutral" }
                 ].map((item, idx) => (
                   <div key={idx} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-slate-100 dark:before:bg-white/5 group">
                      <div className="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-900 shadow-sm" />
                      <div className="space-y-3 p-6 rounded-[2rem] bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-transparent group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-xl group-hover:shadow-indigo-50/50 transition-all duration-500">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 font-black text-[10px]">
                                  {item.teacher.charAt(5)}
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-xs font-black text-slate-900 dark:text-white italic leading-none">{item.teacher}</span>
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                               </div>
                            </div>
                            <Badge className={cn(
                              "text-[8px] font-black uppercase tracking-tighter h-5 px-2 rounded-lg border-none",
                              item.type === "Academic" ? "bg-indigo-50 text-indigo-600" : 
                              item.type === "Behavioral" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                            )}>
                               {item.type}
                            </Badge>
                         </div>
                         <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic leading-relaxed pl-1">
                            "{item.remark}"
                         </p>
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="pt-6 border-t border-slate-50 dark:border-white/5 flex justify-center">
                 <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 px-8 rounded-xl h-10">
                    Submit New Remark
                 </Button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
