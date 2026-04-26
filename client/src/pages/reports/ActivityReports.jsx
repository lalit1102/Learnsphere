import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  FileText, 
  Search, 
  Download, 
  Filter,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ActivityReports = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchActivities = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/activities?page=${page}&limit=20`);
      setActivities(data.activities || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (error) {
      toast.error("Failed to load activity reports");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(currentPage);
  }, [currentPage]);

  const filteredActivities = activities.filter(activity => 
    activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 font-geist animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[10px] font-black">Academic Reports</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Activity Reports</h1>
          <p className="text-muted-foreground font-medium">Visual summary of institutional event logs and engagement metrics.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="rounded-xl h-11 px-6 font-bold border-slate-200">
                <Download className="h-4 w-4 mr-2" /> Export PDF
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100">
                <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="rounded-3xl border-none shadow-xl shadow-slate-100 bg-white p-6">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Calendar className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Events</p>
                    <h3 className="text-2xl font-black">{activities.length}</h3>
                </div>
            </div>
         </Card>
         {/* More summary cards could go here */}
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 animate-pulse">
           <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
           <p className="text-sm font-bold text-slate-400 italic">Generating Academic Reports...</p>
        </div>
      ) : (
        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50 dark:border-white/5">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold">Report Ledger</CardTitle>
                        <CardDescription className="text-sm">Historical archive of logged activities.</CardDescription>
                    </div>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search ledger..." 
                        className="pl-10 h-11 rounded-xl bg-white border-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-white/5">
                <TableRow className="border-none">
                  <TableHead className="pl-8 h-14 font-black text-[10px] uppercase tracking-widest text-slate-400">Date</TableHead>
                  <TableHead className="h-14 font-black text-[10px] uppercase tracking-widest text-slate-400">User</TableHead>
                  <TableHead className="h-14 font-black text-[10px] uppercase tracking-widest text-slate-400">Action Type</TableHead>
                  <TableHead className="pr-8 h-14 font-black text-[10px] uppercase tracking-widest text-slate-400 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((log) => (
                  <TableRow key={log._id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors border-slate-50 dark:border-white/5">
                    <TableCell className="pl-8 py-5 text-sm font-bold text-slate-600">
                        {new Date(log.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                       <span className="font-bold text-slate-800 dark:text-white">{log.user?.name || "System"}</span>
                    </TableCell>
                    <TableCell>
                        <span className="text-sm font-bold text-indigo-600">{log.action}</span>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                       <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold uppercase text-[9px]">Logged</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            <div className="p-8 border-t border-slate-50 dark:border-white/5 bg-slate-50/30 flex items-center justify-between">
               <p className="text-xs font-bold text-slate-400">Page {currentPage} of {totalPages}</p>
               <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-4 rounded-xl font-bold"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-4 rounded-xl font-bold"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Next
                  </Button>
               </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivityReports;
