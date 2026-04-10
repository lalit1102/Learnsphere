import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Download, 
  FileText,
  Loader2,
  Calendar,
  Layers,
  Award,
  BookOpen
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from "recharts";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f43f5e"];

const AcademicReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/reports/academic");
      setData(data.stats);
    } catch (error) {
      toast.error("Failed to aggregate institutional intelligence");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const exportCSV = () => {
    if (!data) return;
    const headers = ["Category", "Name", "Value/Average"];
    const rows = [
      ...data.classPerformance.map(c => ["Class", c.name, c.average]),
      ...data.subjectPerformance.map(s => ["Subject", s.name, s.average]),
      ...data.gradeDistribution.map(g => ["Grade", g.name, g.value])
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Academic_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="text-sm font-black text-slate-400 italic">Synthesizing Academic Metrics...</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[10px] font-black italic">Intelligence Hub</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Academic Analytics</h1>
          <p className="text-muted-foreground font-medium italic">Transforming qualitative outcomes into quantifiable institutional growth.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button onClick={exportCSV} variant="outline" className="h-11 px-6 rounded-2xl border-slate-200 font-bold flex items-center gap-2 group hover:bg-slate-50 transition-all">
              <Download className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              Export Report
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Summary Cards */}
         <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 dark:shadow-none bg-indigo-600 text-white overflow-hidden relative">
            <TrendingUp className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 rotate-12" />
            <CardHeader className="pb-2">
              <CardDescription className="text-indigo-100 font-black uppercase tracking-widest text-[10px]">Total Graded Metrics</CardDescription>
              <CardTitle className="text-4xl font-black">{data?.totalGraded || 0}</CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-xs font-medium italic opacity-80">Processed across all academic cohorts.</p>
            </CardContent>
         </Card>

         <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden border border-slate-100">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Lead Class</CardDescription>
              <CardTitle className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                {data?.classPerformance[0]?.name || "N/A"}
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-2">
                 <Badge className="bg-emerald-50 text-emerald-600 border-none font-black tracking-tighter px-2">
                   {data?.classPerformance[0]?.average || 0}% AVG
                 </Badge>
               </div>
            </CardContent>
         </Card>

         <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden border border-slate-100">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Top Subject</CardDescription>
              <CardTitle className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                {data?.subjectPerformance[0]?.name || "N/A"}
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-2">
                 <Badge className="bg-amber-50 text-amber-600 border-none font-black tracking-tighter px-2">
                   {data?.subjectPerformance[0]?.average || 0}% AVG
                 </Badge>
               </div>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Class Performance Chart */}
         <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 p-8">
            <CardHeader className="px-0 pt-0">
               <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Cohort Performance Matrix</CardTitle>
                    <CardDescription className="font-medium">Visualizing numeric averages across institutional classes.</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="px-0 h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.classPerformance}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} 
                       dy={10}
                     />
                     <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} 
                       domain={[0, 100]}
                     />
                     <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.05)', fontSize: '12px', fontWeight: 900}}
                     />
                     <Bar dataKey="average" fill="#4f46e5" radius={[12, 12, 0, 0]} barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Grade Distribution Chart */}
         <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 p-8">
            <CardHeader className="px-0 pt-0">
               <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <Award className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Achievement Spread</CardTitle>
                    <CardDescription className="font-medium">Quantifying the distribution of academic results.</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="px-0 h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.gradeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data?.gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.05)', fontSize: '12px', fontWeight: 900}}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      align="center"
                      iconType="circle"
                      formatter={(value) => <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{value}</span>}
                    />
                  </PieChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>
      </div>

      {/* Subject Analysis Table */}
      <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 p-10">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-2xl bg-amber-50 flex items-center justify-center">
                 <BookOpen className="h-5 w-5 text-amber-600" />
               </div>
               <div>
                 <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Subject Proficiency Matrix</CardTitle>
                 <CardDescription className="font-medium">Deep dive into course-specific performance trajectories.</CardDescription>
               </div>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.subjectPerformance.map((subj, idx) => (
              <div key={subj.name} className="p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 group hover:border-amber-200 transition-all">
                 <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="text-[9px] font-black tracking-widest border-slate-200 uppercase">COURSE-00{idx+1}</Badge>
                    <div className="text-right">
                       <span className="text-2xl font-black italic text-slate-900">{subj.average}%</span>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Weighted Avg</p>
                    </div>
                 </div>
                 <h4 className="font-black text-lg tracking-tight text-slate-800 italic uppercase mb-4">{subj.name}</h4>
                 <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${subj.average}%` }} 
                    />
                 </div>
              </div>
            ))}
         </div>
      </Card>
    </div>
  );
};

export default AcademicReports;
