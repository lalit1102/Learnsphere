import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Download, FileText, Filter, Search, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { exportToPdf } from "@/lib/exportPdf";

const AttendanceReport = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1 + "");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() + "");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const months = [
    { label: "January", value: "1" }, { label: "February", value: "2" },
    { label: "March", value: "3" }, { label: "April", value: "4" },
    { label: "May", value: "5" }, { label: "June", value: "6" },
    { label: "July", value: "7" }, { label: "August", value: "8" },
    { label: "September", value: "9" }, { label: "October", value: "10" },
    { label: "November", value: "11" }, { label: "December", value: "12" },
  ];

  // Fetch classes for dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await api.get("/classes");
        setClasses(data.classes || []);
      } catch (error) {
        toast.error("Failed to load class registry");
      }
    };
    fetchClasses();
  }, []);

  const generateReport = async () => {
    if (!selectedClass) {
      toast.error("Please select a class first");
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.get(`/attendance/report?classId=${selectedClass}&month=${selectedMonth}&year=${selectedYear}`);
      setReportData(data);
    } catch (error) {
      toast.error("Failed to generate report summary");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!reportData) return;
    const className = classes.find(c => c._id === selectedClass)?.name || "Class";
    exportToPdf("attendance-report-container", `Attendance_Report_${className}_${reportData.month}_${selectedYear}.pdf`);
    toast.success("Preparing PDF export...");
  };

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-100">Analytics Engine</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">Attendance Reports</h1>
          <p className="text-muted-foreground font-medium">Generate comprehensive monthly summaries for institutional auditing.</p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1.5 flex-1 md:flex-none">
             <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Academic Class</label>
             <Select value={selectedClass} onValueChange={setSelectedClass}>
               <SelectTrigger className="w-full md:w-[180px] h-11 rounded-xl bg-white border-slate-200 shadow-sm">
                 <SelectValue placeholder="Select Class" />
               </SelectTrigger>
               <SelectContent className="rounded-xl">
                 {classes.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
               </SelectContent>
             </Select>
          </div>
          <div className="flex flex-col gap-1.5 flex-1 md:flex-none">
             <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Period</label>
             <div className="flex gap-2">
               <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                 <SelectTrigger className="w-[120px] h-11 rounded-xl bg-white border-slate-200 shadow-sm">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl">
                    {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                 </SelectContent>
               </Select>
               <Select value={selectedYear} onValueChange={setSelectedYear}>
                 <SelectTrigger className="w-[100px] h-11 rounded-xl bg-white border-slate-200 shadow-sm">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl">
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                 </SelectContent>
               </Select>
             </div>
          </div>
          <Button 
            onClick={generateReport} 
            disabled={loading}
            className="self-end h-11 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-100"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Filter className="h-4 w-4 mr-2" />}
            Generate
          </Button>
        </div>
      </div>

      {reportData ? (
        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-indigo-100/50 bg-white overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="p-10 border-b border-slate-50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black">Monthly Roster Summary</CardTitle>
              <CardDescription className="text-sm font-medium">Record for {reportData.month} {reportData.year}</CardDescription>
            </div>
            <Button 
               variant="outline" 
               className="h-11 px-6 rounded-xl border-2 font-bold gap-2 hover:bg-slate-900 hover:text-white transition-all"
               onClick={handleExport}
            >
              <Download className="h-4 w-4" /> Export PDF
            </Button>
          </CardHeader>
          <CardContent className="p-0" id="attendance-report-container">
            <div className="p-10 pb-4 flex justify-between items-start">
               <div className="space-y-1">
                  <h4 className="text-xl font-bold text-indigo-600">
                    {classes.find(c => c._id === selectedClass)?.name}
                  </h4>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-[0.2em]">Institutional Report</p>
               </div>
               <div className="text-right">
                  <p className="text-xs font-bold text-slate-400">Generated On</p>
                  <p className="text-sm font-black">{new Date().toLocaleDateString()}</p>
               </div>
            </div>
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none">
                  <TableHead className="pl-10 h-14 font-black uppercase text-[10px] tracking-widest text-slate-400">Student Identity</TableHead>
                  <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">Present</TableHead>
                  <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">Absent</TableHead>
                  <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">Late</TableHead>
                  <TableHead className="pr-10 h-14 font-black uppercase text-[10px] tracking-widest text-slate-400 text-right">Performance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.summary.map((row) => (
                  <TableRow key={row._id} className="hover:bg-slate-50 transition-colors border-slate-50">
                    <TableCell className="pl-10 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{row.studentName}</span>
                        <span className="text-[10px] font-medium text-slate-400">{row.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-emerald-600">{row.present}</TableCell>
                    <TableCell className="text-center font-bold text-rose-500">{row.absent}</TableCell>
                    <TableCell className="text-center font-bold text-amber-500">{row.late}</TableCell>
                    <TableCell className="pr-10 text-right">
                      <Badge className={`rounded-lg px-2 py-0.5 font-bold ${row.percentage > 85 ? 'bg-emerald-500' : row.percentage > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}>
                        {row.percentage}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-10 border-t border-slate-50 bg-slate-50/30">
               <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Students</p>
                     <p className="text-2xl font-black">{reportData.summary.length}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Class Performance</p>
                     <p className="text-2xl font-black text-indigo-600">
                        {Math.round(reportData.summary.reduce((acc, curr) => acc + curr.percentage, 0) / reportData.summary.length)}%
                     </p>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-[3rem] border-slate-100 text-slate-300 gap-4 opacity-50 bg-white shadow-inner">
           <FileText className="h-16 w-16" />
           <p className="font-extrabold text-xl italic tracking-tight uppercase">Select Registry Data to Generate Report</p>
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;
