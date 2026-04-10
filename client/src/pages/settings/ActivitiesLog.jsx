import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import {
  Activity,
  Search,
  Trash2,
  CheckCircle2,
  AlertCircle,
  User
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api";

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import CustomPagination from "@/components/global/CustomPagination";

/**
 * ActivitiesLog Page: A high-integrity audit log of system-wide administrative actions.
 * Optimized for oversight with faceted filtering and user role attribution.
 */
const ActivitiesLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /**
   * Fetch Activity Logs from system registry.
   */
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "10");

      const { data } = await api.get(`/activities?${params.toString()}`);

      // Backend returns { logs: [], pages: N, total: M }
      if (data && data.logs) {
        setLogs(data.logs);
        setTotalPages(data.pages || 1);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error("Failed to load activities", error);
      toast.error("Failed to synchronize activity logs");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  /**
   * Normalize action labels for visual classification.
   */
  const getActionBadge = (action) => {
    const act = action.toLowerCase();
    if (act.includes("create") || act.includes("provision")) {
      return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold uppercase text-[9px] px-2 py-0.5 rounded-lg">Creation</Badge>;
    }
    if (act.includes("update") || act.includes("modify")) {
      return <Badge className="bg-amber-50 text-amber-700 border-amber-100 font-bold uppercase text-[9px] px-2 py-0.5 rounded-lg">Update</Badge>;
    }
    if (act.includes("delete") || act.includes("decommission")) {
      return <Badge className="bg-rose-50 text-rose-700 border-rose-100 font-bold uppercase text-[9px] px-2 py-0.5 rounded-lg">Suspension</Badge>;
    }
    return <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold uppercase text-[9px] px-2 py-0.5 rounded-lg">System Event</Badge>;
  };

  return (
    <div className="p-8 lg:p-10 space-y-8 max-w-7xl mx-auto font-geist">
      {/* HEADER: Strategic Oversight */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-500 animate-in fade-in slide-in-from-top-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center rounded-xl">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
            System Pulse
          </h1>
          <p className="text-muted-foreground text-base max-w-xl">
            Real-time administrative audit trail monitoring institutional integrity and data synchronization.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search event registry..."
              className="pl-10 h-11 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-indigo-500 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* REGISTRY: Audit Trail */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-xl shadow-slate-100 dark:shadow-none animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
            <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="font-bold text-slate-500 py-4 px-6">Event Identity</TableHead>
              <TableHead className="font-bold text-slate-500 py-4">Responsible Actor</TableHead>
              <TableHead className="font-bold text-slate-500 py-4">Event Description</TableHead>
              <TableHead className="font-bold text-slate-500 py-4">System Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="border-slate-50 dark:border-slate-900">
                  <TableCell className="px-6 py-4"><Skeleton className="h-5 w-24 rounded-lg" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-8 w-32 rounded-full" /></TableCell>
                  <TableCell className="py-4"><Skeleton className="h-4 w-64 rounded-md" /></TableCell>
                  <TableCell className="py-4 px-6"><Skeleton className="h-4 w-32 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-30">
                    <Trash2 className="h-10 w-10" />
                    <p className="text-sm italic">The system registry is currently vacant of relevant entries.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log._id} className="border-slate-50 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <TableCell className="px-6 py-4">
                    {getActionBadge(log.action)}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {log.user?.name?.charAt(0) || <User className="h-3 w-3" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{log.user?.name || "System Automated"}</span>
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{log.user?.role || "Global Admin"}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                    {log.details || "Administrative modification initiated."}
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {format(new Date(log.createdAt), "MMM dd, yyyy")}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 font-mono">
                        {format(new Date(log.createdAt), "HH:mm:ss OOOO")}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* PAGINATION: Oversight scaling */}
        <div className="p-6 border-t border-slate-50 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-900/10">
          <CustomPagination
            loading={loading}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivitiesLog;
