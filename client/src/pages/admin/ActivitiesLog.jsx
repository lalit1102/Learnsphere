import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  ShieldAlert, 
  Search, 
  History, 
  Globe, 
  Monitor, 
  Clock, 
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

const ActivitiesLog = () => {
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
      toast.error("Failed to synchronize system logs");
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
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-rose-50 text-rose-600 border-rose-100 uppercase tracking-widest text-[10px] font-black">Security Audit</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">System Activities</h1>
          <p className="text-muted-foreground font-medium">Monitoring granular institutional actions and access metadata.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search Action or User..." 
                className="pl-10 h-11 rounded-xl bg-white border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 animate-pulse">
           <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
           <p className="text-sm font-bold text-slate-400 italic">Syncing Audit Logs...</p>
        </div>
      ) : (
        <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50 dark:border-white/5">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                   <History className="h-6 w-6" />
                </div>
                <div>
                   <CardTitle className="text-xl font-bold">Activity Feed</CardTitle>
                   <CardDescription className="text-sm">Real-time trace of administrative and academic events.</CardDescription>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-white/5">
                <TableRow className="border-none">
                  <TableHead className="pl-8 h-14 font-black text-[10px] uppercase tracking-widest text-slate-400">Timestamp</TableHead>
                  <TableHead className="h-14 font-black text-[10px] uppercase tracking-widest text-slate-400">Agent</TableHead>
                  <TableHead className="h-14 font-black text-[10px] uppercase tracking-widest text-slate-400">Institutional Action</TableHead>
                  <TableHead className="h-14 font-black text-[10px] uppercase tracking-widest text-slate-400">Metadata (IP/Device)</TableHead>
                  <TableHead className="pr-8 h-14 font-black text-[10px] uppercase tracking-widest text-slate-400 text-right">Scope</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((log) => (
                  <TableRow key={log._id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors border-slate-50 dark:border-white/5">
                    <TableCell className="pl-8 py-5">
                       <div className="flex items-center gap-2 text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs font-bold">{new Date(log.timestamp).toLocaleString()}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-white">{log.user?.name || "System"}</span>
                          <span className="text-[10px] font-medium text-slate-400">{log.user?.email}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-indigo-600">{log.action}</span>
                          <span className="text-xs text-slate-500 font-medium line-clamp-1">{log.details}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                             <Globe className="h-3 w-3" /> {log.ip || "0.0.0.0"}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                             <Monitor className="h-3 w-3" /> <span className="max-w-[150px] truncate">{log.userAgent || "Internal"}</span>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                       <Badge variant="outline" className="font-bold uppercase text-[9px] border-slate-200 text-slate-500">
                          {log.user?.role || "Core"}
                       </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            <div className="p-8 border-t border-slate-50 dark:border-white/5 bg-slate-50/30 flex items-center justify-between">
               <p className="text-xs font-bold text-slate-400">Showing page {currentPage} of {totalPages}</p>
               <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-4 rounded-xl font-bold"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Earlier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-4 rounded-xl font-bold"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
               </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && activities.length === 0 && (
        <div className="h-80 border-2 border-dashed rounded-[3rem] border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50 bg-white shadow-inner">
           <ShieldAlert className="h-16 w-16" />
           <p className="font-extrabold text-xl italic tracking-tight uppercase">No Institutional Actions Recorded Yet</p>
        </div>
      )}
    </div>
  );
};

export default ActivitiesLog;
