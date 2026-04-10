import React from "react";
import { Badge } from "@/components/ui/badge";
import { Banknote, Construction } from "lucide-react";

const ExpenseManagement = () => {
  return (
    <div className="p-8 lg:p-10 max-w-6xl mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8 border-slate-200 dark:border-white/5">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-rose-50 text-rose-600 border-rose-100 uppercase tracking-widest text-[10px] font-black italic">Financial Module</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Banknote className="h-10 w-10 text-emerald-500" />
            Expense Management
          </h1>
          <p className="text-muted-foreground font-medium italic">Track institutional outgoing revenue and resource expenditures.</p>
        </div>
      </div>

      <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
        <div className="bg-emerald-100 dark:bg-emerald-500/20 p-4 rounded-full mb-4">
          <Construction className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-black italic text-slate-800 dark:text-slate-200">Module Under Construction</h2>
        <p className="text-slate-500 max-w-md font-medium">
          The comprehensive Expense Management engine is currently being developed and will be deployed in a future phase.
        </p>
      </div>
    </div>
  );
};

export default ExpenseManagement;
