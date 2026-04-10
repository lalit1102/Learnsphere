import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CustomInput } from "@/components/global/CustomInput";
import { Calendar, CheckCircle2, Loader2, Plus, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AcademicYears = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  
  const { user } = useAuth();
  const isSuperAdmin = user?.isSuperAdmin;

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      isCurrent: false
    }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/academic-years");
      setAcademicYears(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch academic calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onAddAcademicYear = async (data) => {
    try {
      if (!isSuperAdmin) {
        toast.error("Exclusive Super Administrator command required.");
        return;
      }
      setIsAddRouteOpen(false);
      await api.post("/academic-years", data);
      toast.success("Academic year successfully established.");
      reset();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create academic year");
    }
  };

  const handleSetCurrent = async (id) => {
    try {
      if (!isSuperAdmin) {
        toast.error("Exclusive Super Administrator command required.");
        return;
      }
      setProcessingId(id);
      await api.put(`/academic-years/${id}/current`);
      toast.success("Active Academic Year has been shifted.");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action blocked");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-8 lg:p-10 max-w-6xl mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[10px] font-black italic">System Configuration</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Calendar className="h-10 w-10 text-indigo-500" />
            Academic Years
          </h1>
          <p className="text-muted-foreground font-medium italic">Define active academic calendars globally across the system.</p>
        </div>
        
        {isSuperAdmin && (
          <Dialog open={isAddRouteOpen} onOpenChange={setIsAddRouteOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black shadow-xl uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">
                <Plus className="h-5 w-5" /> Initialize New Term
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-[2.5rem] p-8 border-none shadow-2xl">
              <DialogHeader className="mb-6 border-b pb-6">
                <DialogTitle className="text-2xl font-black italic uppercase">Initialize Term</DialogTitle>
                <DialogDescription className="font-medium italic text-slate-500">
                  Register a new academic calendar into the institution's registry.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onAddAcademicYear)} className="space-y-6">
                <CustomInput 
                  control={control} 
                  name="name" 
                  label="Academic Identifier" 
                  placeholder="e.g., 2026-27" 
                  rules={{ required: "Identifier is required" }} 
                />
                <div className="grid grid-cols-2 gap-4">
                  <CustomInput control={control} type="date" name="startDate" label="Start Date" rules={{ required: "Required" }} />
                  <CustomInput control={control} type="date" name="endDate" label="End Date" rules={{ required: "Required" }} />
                </div>
                <DialogFooter className="mt-8">
                  <Button type="submit" className="w-full h-12 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 uppercase tracking-widest">
                    Create Term
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-sm font-bold text-slate-400 italic">Syncing Calendar Data...</p>
        </div>
      ) : (
        <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="border-none">
                <TableHead className="pl-10 h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Term Name</TableHead>
                <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Dates Config</TableHead>
                <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">State</TableHead>
                <TableHead className="pr-10 h-16 text-right font-black text-[10px] uppercase tracking-widest text-slate-400">Governance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {academicYears.map((year) => (
                <TableRow key={year._id} className="hover:bg-slate-50/80 transition-colors border-slate-50 dark:border-white/5 group">
                  <TableCell className="pl-10 py-6">
                     <span className="font-black text-slate-800 dark:text-white text-lg tracking-tight leading-tight">{year.name}</span>
                  </TableCell>
                  <TableCell>
                     <div className="flex flex-col gap-1 font-bold italic">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                           <span className="opacity-50">Start:</span> {format(new Date(year.startDate), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                           <span className="opacity-50">End:</span> {format(new Date(year.endDate), "MMM d, yyyy")}
                        </div>
                     </div>
                  </TableCell>
                  <TableCell>
                     {year.isCurrent ? (
                       <Badge className="bg-emerald-100 text-emerald-700 border-none font-black flex gap-1 w-fit italic tracking-widest text-[9px] px-3 pointer-events-none">
                          <CheckCircle2 className="h-3 w-3" /> ACTIVE TERM
                       </Badge>
                     ) : (
                       <Badge variant="outline" className="text-slate-400 border-none shadow-none font-black italic tracking-widest text-[9px] px-3 pointer-events-none">
                          Inactive
                       </Badge>
                     )}
                  </TableCell>
                  <TableCell className="pr-10 text-right">
                     {!year.isCurrent && isSuperAdmin && (
                       <Button 
                         variant="ghost"
                         onClick={() => handleSetCurrent(year._id)}
                         disabled={processingId === year._id}
                         className="h-10 px-4 rounded-xl text-indigo-600 hover:bg-indigo-50 font-bold uppercase tracking-widest text-[10px]"
                       >
                         {processingId === year._id ? <Loader className="h-4 w-4 animate-spin text-indigo-400" /> : "Set As Current"}
                       </Button>
                     )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default AcademicYears;
