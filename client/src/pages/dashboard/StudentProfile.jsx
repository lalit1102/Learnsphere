import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowLeft, 
  Loader2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Calendar,
  PhoneCall
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      let res;
      try {
        res = await api.get(`/students/${id}`);
      } catch (err) {
        if (err.response?.status === 404) {
          res = await api.get(`/students/user/${id}`);
        } else {
          throw err;
        }
      }
      setStudent(res.data.student || res.data);
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      toast.error("Failed to load student profile");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium animate-pulse">Retrieving student registry...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center gap-6">
        <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 text-center space-y-6 max-w-md">
           <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto">
              <AlertCircle className="h-10 w-10" />
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Student Not Found</h2>
              <p className="text-gray-500">The requested profile does not exist in our institutional records.</p>
           </div>
           <Button onClick={() => navigate(-1)} className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-12">
              Back to Dashboard
           </Button>
        </div>
      </div>
    );
  }

  const userData = student.user || {};
  const attendancePercent = 88; // Mock data for now
  const isAttendanceLow = attendancePercent < 75;

  return (
    <div className="min-h-screen bg-background font-sans pb-20">
      {/* Top Header & Navigation */}
      <div className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-muted-foreground hover:text-primary font-semibold transition-all"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Registry
          </Button>
          <div className="flex items-center gap-4">
             <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold px-4 py-1.5 rounded-xl uppercase tracking-widest text-[10px]">
                Institutional ID: {student.grNumber}
             </Badge>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar: Profile Summary */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="bg-card border-border shadow-sm rounded-3xl overflow-hidden">
               <CardContent className="pt-12 pb-10 text-center space-y-8">
                  <div className="relative inline-block">
                    <div className="h-36 w-36 rounded-3xl bg-muted border-4 border-card shadow-lg overflow-hidden mx-auto transition-transform hover:scale-105 duration-500">
                       {userData.profileImage ? (
                         <img src={userData.profileImage} alt={userData.name} className="h-full w-full object-cover" />
                       ) : (
                         <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                            <UserIcon className="h-20 w-20" />
                         </div>
                       )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary rounded-2xl border-4 border-card flex items-center justify-center shadow-lg">
                       <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl font-black text-foreground tracking-tight italic">{userData.name}</h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">{userData.email}</p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                     <Badge className="bg-primary text-primary-foreground border-none font-black px-4 py-1 rounded-xl uppercase tracking-widest text-[9px]">Authorized Student</Badge>
                     <Badge variant="secondary" className="font-black px-4 py-1 rounded-xl uppercase tracking-widest text-[9px]">{student.user?.studentClass?.name || "Grade 10-A"}</Badge>
                  </div>

                  <div className="pt-8 border-t border-border space-y-5">
                     <div className="flex items-center justify-between text-xs px-6 font-bold uppercase tracking-widest">
                        <span className="text-muted-foreground">Enrollment Date</span>
                        <span className="text-foreground">Sept 12, 2023</span>
                     </div>
                     <div className="flex items-center justify-between text-xs px-6 font-bold uppercase tracking-widest">
                        <span className="text-muted-foreground">Verification</span>
                        <span className="text-primary flex items-center gap-1.5 font-black">
                           <ShieldCheck className="w-4 h-4" /> SECURED
                        </span>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Attendance Quick View */}
            <Card className="bg-card border-border shadow-sm rounded-3xl p-8 space-y-5">
               <div className="flex items-center justify-between">
                  <h3 className="font-black text-foreground uppercase tracking-widest text-xs flex items-center gap-2 italic">
                     <Calendar className="w-4 h-4 text-primary" /> Temporal Presence
                  </h3>
                  <span className={cn("text-xl font-black italic", isAttendanceLow ? "text-destructive" : "text-primary")}>
                     {attendancePercent}%
                  </span>
               </div>
               <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", isAttendanceLow ? "bg-destructive" : "bg-primary")}
                    style={{ width: `${attendancePercent}%` }}
                  />
               </div>
               <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest italic leading-relaxed">
                  {isAttendanceLow ? "Immediate intervention required: threshold breach." : "Consistent institutional participation verified."}
               </p>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* Guardian Details Card */}
            <Card className="bg-card border-border shadow-md rounded-3xl overflow-hidden">
               <CardHeader className="border-b border-border py-8 px-10">
                  <CardTitle className="text-2xl font-black text-foreground italic uppercase tracking-tight flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                        <Users className="w-6 h-6" />
                     </div>
                     Guardian Registry
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Primary Guardian Identity</label>
                        <p className="text-xl font-black text-foreground">{student.parentName || "Institutional Guardian"}</p>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Communication Line</label>
                        <div className="flex items-center gap-4">
                           <p className="text-xl font-bold text-foreground">{student.parentPhone || "N/A"}</p>
                           {student.parentPhone && (
                             <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-11 px-6 gap-2 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all active:scale-95">
                                <PhoneCall className="w-4 h-4" /> Call Registry
                             </Button>
                           )}
                        </div>
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Institutional Relationship</label>
                        <p className="text-xl font-black text-foreground">Legal Guardian</p>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Residential Coordinates</label>
                        <p className="text-sm font-bold text-muted-foreground leading-relaxed flex items-start gap-3 italic">
                           <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                           {student.address || "Main School Campus, Block B-402, Academic City."}
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Academic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card className="bg-card border-border shadow-sm rounded-3xl p-10 space-y-6 group hover:shadow-md transition-all border-l-4 border-l-primary">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                     <GraduationCap className="w-8 h-8" />
                  </div>
                  <div className="space-y-3">
                     <h4 className="text-xl font-black text-foreground italic uppercase tracking-tight">Academic Cohort</h4>
                     <p className="text-muted-foreground font-medium leading-relaxed italic text-sm">Assigned to {student.user?.studentClass?.name || "Grade 10-A"}. All syllabus materials are synchronized.</p>
                  </div>
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:bg-transparent font-black flex items-center gap-2 text-[10px] uppercase tracking-widest">
                     View Syllabus <ExternalLink className="w-4 h-4" />
                  </Button>
               </Card>

               <Card className="bg-card border-border shadow-sm rounded-3xl p-10 space-y-6 group hover:shadow-md transition-all border-l-4 border-l-chart-2">
                  <div className="h-14 w-14 rounded-2xl bg-chart-2/10 text-chart-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Mail className="w-8 h-8" />
                  </div>
                  <div className="space-y-3">
                     <h4 className="text-xl font-black text-foreground italic uppercase tracking-tight">Correspondence</h4>
                     <p className="text-muted-foreground font-medium leading-relaxed italic text-sm">Viewing direct faculty-to-parent correspondence and analytical alerts.</p>
                  </div>
                  <Button variant="ghost" className="p-0 h-auto text-chart-2 hover:bg-transparent font-black flex items-center gap-2 text-[10px] uppercase tracking-widest">
                     Open Inbox <ExternalLink className="w-4 h-4" />
                  </Button>
               </Card>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default StudentProfile;

// Import missing icon
function Users(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
