import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Wallet, Loader2, Download, Receipt, CheckCircle, Save, Settings, AlertCircle, Printer, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";

const SalaryManagement = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Format: YYYY-MM
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({ baseSalary: 0, allowances: 0, deductions: 0 });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [activeSlip, setActiveSlip] = useState(null);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/salary?monthYear=${selectedMonth}`);
      setSalaries(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load payroll data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      fetchSalaries();
    }
  }, [selectedMonth]);

  const handleMarkAsPaid = async (id) => {
    try {
      setLoading(true);
      await api.put(`/salary/${id}/pay`);
      toast.success("Compensation successfully dispatched!");
      fetchSalaries();
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment execution failed");
    } finally {
      setLoading(false);
    }
  };

  const openEditConfig = (record) => {
    setEditingRecord(record);
    setEditForm({
      baseSalary: record.baseSalary,
      allowances: record.allowances,
      deductions: record.deductions
    });
    setIsEditModalOpen(true);
  };

  const submitEditConfig = async () => {
    try {
      setLoading(true);
      await api.put(`/salary/${editingRecord._id}/config`, editForm);
      toast.success("Payroll boundaries synchronized");
      setIsEditModalOpen(false);
      fetchSalaries();
    } catch (error) {
      toast.error(error.response?.data?.message || "Re-calibration failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintSlip = () => {
     window.print();
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 md:space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header (Hidden when printing slip) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 border-b pb-6 md:pb-8 print:hidden">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-widest text-[10px] font-black italic">Financial Module</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Wallet className="h-10 w-10 text-emerald-500" />
            Salary Management
          </h1>
          <p className="text-muted-foreground font-medium italic">Process institutional payroll and generate formal compensation slips.</p>
        </div>

        <div className="flex gap-4">
           <input 
             type="month" 
             value={selectedMonth}
             onChange={(e) => setSelectedMonth(e.target.value)}
             className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
           />
        </div>
      </div>

      <div className="print:hidden">
      {loading && salaries.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="text-sm font-bold text-slate-400 italic">Computing Net Variables...</p>
        </div>
      ) : salaries.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800">
           <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Payroll Configurations</h3>
           <p className="text-slate-500">No staff found to generate payroll for {selectedMonth}.</p>
        </div>
      ) : (
        <Card className="rounded-[2rem] border-none shadow-xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-6 pb-4">
             <CardTitle className="text-xl font-black italic flex items-center gap-2">
                 Staff Payroll — {new Date(selectedMonth + "-01").toLocaleString("default", { month: "long", year: "numeric" })}
             </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                <TableRow className="border-b-slate-100 dark:border-slate-800">
                  <TableHead className="font-bold text-slate-500 py-4 px-6 uppercase tracking-widest text-[10px]">Staff</TableHead>
                  <TableHead className="font-bold text-slate-500 py-4 px-6 uppercase tracking-widest text-[10px] text-center">Attendance</TableHead>
                  <TableHead className="font-bold text-slate-500 py-4 px-6 uppercase tracking-widest text-[10px] text-right">Base Pay</TableHead>
                  <TableHead className="font-bold text-slate-500 py-4 px-6 uppercase tracking-widest text-[10px] text-right">Allow / Deduct</TableHead>
                  <TableHead className="font-bold text-slate-500 py-4 px-6 uppercase tracking-widest text-[10px] text-right">Net Salary</TableHead>
                  <TableHead className="font-bold text-slate-500 py-4 px-6 uppercase tracking-widest text-[10px] text-center">Status</TableHead>
                  <TableHead className="font-bold text-slate-500 py-4 px-6 uppercase tracking-widest text-[10px] text-right">Control Array</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaries.map((record) => (
                  <TableRow key={record._id} className="border-b-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <TableCell className="py-4 px-6">
                      <div>
                         <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{record.staff.name}</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic flex items-center gap-1">
                            {record.staff.role}
                         </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                       <Badge variant="outline" className={`font-black text-[10px] border-emerald-100 ${record.attendancePercentage >= 95 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {record.attendancePercentage}%
                       </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right font-bold text-slate-600 dark:text-slate-300">
                      ${record.baseSalary.toLocaleString()}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                       <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-bold text-emerald-600">+ ${record.allowances.toLocaleString()}</span>
                          <span className="text-xs font-bold text-rose-500">- ${record.deductions.toLocaleString()}</span>
                       </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">${record.netSalary.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                       {record.status === "Paid" ? (
                          <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 border-none px-3 font-bold uppercase tracking-widest text-[10px] animate-in zoom-in">Paid</Badge>
                       ) : (
                          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 px-3 font-bold uppercase tracking-widest text-[10px]">Pending</Badge>
                       )}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right flex items-center justify-end gap-2">
                       {record.status !== "Paid" && (
                         <>
                           <Button 
                             size="icon" 
                             variant="outline" 
                             className="h-8 w-8 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                             onClick={() => openEditConfig(record)}
                           >
                             <Settings className="h-4 w-4" />
                           </Button>
                           <Button 
                             size="sm" 
                             className="h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold tracking-widest text-[10px] uppercase shadow-md shadow-emerald-500/20"
                             onClick={() => handleMarkAsPaid(record._id)}
                             disabled={loading}
                           >
                             <CheckCircle className="h-3 w-3 mr-1" /> Pay
                           </Button>
                         </>
                       )}
                       {record.status === "Paid" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 rounded-lg font-bold tracking-widest text-[10px] uppercase border-slate-200 text-slate-600"
                            onClick={() => {
                               setActiveSlip(record);
                               setIsSlipModalOpen(true);
                            }}
                          >
                             <Receipt className="h-4 w-4 mr-1.5" /> Slip
                          </Button>
                       )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      </div>

      {/* Constraints Config Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
         <DialogContent className="max-w-md w-[95vw] sm:max-w-md rounded-[2rem] p-0 border border-emerald-500/30 overflow-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl">
            <div className="p-6 md:p-8 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-white/5">
               <DialogTitle className="text-xl font-black italic uppercase flex items-center gap-3">
                  <Settings className="h-5 w-5 text-emerald-500" />
                  Calibrate Compensation
               </DialogTitle>
               <DialogDescription className="font-medium mt-1 text-xs">
                  Modify boundaries for {editingRecord?.staff?.name}.
               </DialogDescription>
            </div>
            <div className="p-6 md:p-8 space-y-4">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Base Salary ($)</label>
                  <Input 
                    type="number" 
                    value={editForm.baseSalary} 
                    onChange={e => setEditForm(p => ({ ...p, baseSalary: Number(e.target.value)}))}
                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border-none font-bold text-lg"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-emerald-600 italic">Allowances ($) (Bonus)</label>
                  <Input 
                    type="number" 
                    value={editForm.allowances} 
                    onChange={e => setEditForm(p => ({ ...p, allowances: Number(e.target.value)}))}
                    className="h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-none font-bold text-emerald-700 dark:text-emerald-300 text-lg"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-rose-600 italic">Deductions ($) (Tax / Penalties)</label>
                  <Input 
                    type="number" 
                    value={editForm.deductions} 
                    onChange={e => setEditForm(p => ({ ...p, deductions: Number(e.target.value)}))}
                    className="h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 border-none font-bold text-rose-700 dark:text-rose-300 text-lg"
                  />
               </div>
            </div>
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 flex gap-3 justify-end">
               <Button 
                 variant="ghost" 
                 onClick={() => setIsEditModalOpen(false)}
                 className="rounded-xl font-bold tracking-widest uppercase text-xs px-6"
               >Cancel</Button>
               <Button 
                  onClick={submitEditConfig}
                  className="rounded-xl bg-slate-900 dark:bg-emerald-500 text-white font-bold uppercase tracking-widest text-xs px-6"
               ><Save className="h-4 w-4 mr-2"/> Apply</Button>
            </div>
         </DialogContent>
      </Dialog>

      {/* Slip Generator Modal */}
      <Dialog open={isSlipModalOpen} onOpenChange={setIsSlipModalOpen}>
         <DialogContent className="max-w-2xl w-[95vw] rounded-xl p-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden print:w-full print:shadow-none print:border-none print:relative print:max-w-full">
            {/* Action Bar (Hidden on print) */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 print:hidden">
               <h3 className="font-bold text-sm tracking-widest uppercase flex items-center gap-2"><Receipt className="h-4 w-4"/> Slip Preview</h3>
               <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8" onClick={handlePrintSlip}>
                     <Printer className="h-3.5 w-3.5 mr-2" /> Print PDF
                  </Button>
                  <DialogClose asChild>
                     <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsSlipModalOpen(false)}>
                        <X className="h-4 w-4" />
                     </Button>
                  </DialogClose>
               </div>
            </div>

            {/* Slip Standardized Body */}
            {activeSlip && (
               <div className="p-8 md:p-12 space-y-8 bg-white dark:bg-slate-950">
                  <div className="text-center space-y-1">
                     <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Learnsphere</h2>
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Official Compensation Transcript</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 border-y border-dashed border-slate-200 dark:border-slate-800 py-6">
                     <div className="space-y-4">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Employee Details</p>
                           <p className="font-bold text-base text-slate-800 dark:text-slate-100">{activeSlip.staff.name}</p>
                           <p className="text-sm text-slate-500 capitalize">{activeSlip.staff.role}</p>
                           <p className="text-sm text-slate-500">{activeSlip.staff.email}</p>
                        </div>
                     </div>
                     <div className="space-y-4 text-right">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Metadata</p>
                           <p className="font-bold text-sm text-slate-800 dark:text-slate-100">Cycle: {new Date(activeSlip.monthYear + "-01").toLocaleString("default", { month: "short", year: "numeric" })}</p>
                           <p className="text-sm text-slate-500">Transact ID: {activeSlip._id.slice(-6).toUpperCase()}</p>
                           <p className="text-sm text-slate-500">Date: {new Date(activeSlip.paymentDate).toLocaleDateString()}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-600 dark:text-slate-300">Base Salary</span>
                        <span className="font-bold">${activeSlip.baseSalary.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-emerald-600">Total Allowances</span>
                        <span className="font-bold text-emerald-600">${activeSlip.allowances.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-rose-600">Authorized Deductions</span>
                        <span className="font-bold text-rose-600">${activeSlip.deductions.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-600 dark:text-slate-300">Attendance Quotient ({activeSlip.attendancePercentage}%)</span>
                        <span className="font-medium text-slate-400 text-sm italic">- Mathematical Offset Applied</span>
                     </div>
                  </div>

                  <div className="pt-6">
                     <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl flex justify-between items-center border border-slate-200 dark:border-slate-800">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Processed Compensation</p>
                           <h1 className="text-4xl font-black text-slate-900 dark:text-white">${activeSlip.netSalary.toLocaleString()}</h1>
                        </div>
                        <CheckCircle className="h-16 w-16 text-emerald-500/20" />
                     </div>
                  </div>
               </div>
            )}
         </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalaryManagement;
