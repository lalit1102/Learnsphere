import React, { useEffect, useState } from "react";
import { GraduationCap, BookOpen, UserCheck, LayoutDashboard, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { api } from "@/lib/api";

const MyLearning = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearning = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/users/my-learning");
        setData(data);
      } catch (error) {
        toast.error("Failed to load your learning directory");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLearning();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="text-muted-foreground animate-pulse">Synchronizing your curriculum...</p>
      </div>
    );
  }

  if (!data?.classInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
        <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center ring-8 ring-slate-100/50">
          <GraduationCap className="h-12 w-12 text-slate-300" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="text-2xl font-bold">Unassigned Profile</h2>
          <p className="text-muted-foreground tracking-tight">You haven't been mapped to an academic class yet. Please contact the administration for registry fulfillment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Stats Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-12 w-12 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 flex items-center justify-center text-white">
                <BookOpen className="h-6 w-6" />
             </div>
             <div className="space-y-0.5">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                  My Learning <span className="text-indigo-600">Portal</span>
                </h1>
                <p className="text-muted-foreground font-medium">Curriculum overview for {data.classInfo.name}</p>
             </div>
          </div>
        </div>

        <Card className="rounded-3xl border-none shadow-xl bg-slate-900 text-white overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles className="h-20 w-20" />
           </div>
           <CardContent className="p-6 relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-4">Registry Info</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-medium">GR Number</span>
                  <Badge className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors">
                    {data.grNumber || "N/A"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-medium">Current Class</span>
                  <span className="font-bold text-lg">{data.classInfo.name}</span>
                </div>
              </div>
           </CardContent>
        </Card>
      </div>

      {/* Main Content: Subjects & Teachers */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="text-xl font-bold flex items-center gap-2">
             <LayoutDashboard className="h-5 w-5 text-indigo-500" />
             Enrolled Subjects
           </h3>
           <Badge variant="secondary" className="px-3 py-1 rounded-full font-bold">
             {data.subjects?.length || 0} Modules
           </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.subjects?.map((subject) => (
            <Card key={subject._id} className="rounded-3xl border-none shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white dark:bg-slate-950/50">
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase opacity-50">
                    {subject.code}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">
                    {subject.name}
                  </h4>
                </div>

                {/* Teacher Subsection */}
                <div className="pt-4 border-t border-slate-50 dark:border-white/5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Assigned Faculty</p>
                  <div className="space-y-3">
                    {subject.teacher?.length > 0 ? (
                      subject.teacher.map((t) => (
                        <div key={t._id} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                          <Avatar className="h-8 w-8 border border-white shadow-sm">
                            <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs font-bold">
                              {t.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.name}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{t.email}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-slate-300 italic text-xs">
                        <UserCheck className="h-4 w-4" />
                        Awaiting assignment
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyLearning;
