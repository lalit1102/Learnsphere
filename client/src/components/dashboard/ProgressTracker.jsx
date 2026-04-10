import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, CheckCircle, Clock } from "lucide-react";

export const ProgressTracker = ({ data }) => {
  const percentage = data?.progress || 0;
  
  const chartData = [
    { name: "Completed", value: data?.submissionsDone || 0 },
    { name: "Pending", value: (data?.assignmentsTotal || 0) - (data?.submissionsDone || 0) },
  ];

  const COLORS = ["#4f46e5", "#f1f5f9"];

  return (
    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden h-full">
      <CardHeader className="p-8 pb-0">
        <div className="flex items-center justify-between font-geist">
          <div className="space-y-1">
             <CardTitle className="text-2xl font-black">Submission Velocity</CardTitle>
             <CardDescription className="text-sm font-medium">Monitoring your curriculum fulfillment.</CardDescription>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
             <Target className="h-6 w-6" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="h-[200px] w-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">{percentage}%</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Goal Status</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
             <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-3">
                   <CheckCircle className="h-5 w-5 text-indigo-500" />
                   <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Handed In</span>
                </div>
                <span className="text-lg font-black">{data?.submissionsDone || 0}</span>
             </div>
             <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-3">
                   <Clock className="h-5 w-5 text-amber-500" />
                   <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Awaiting Submissions</span>
                </div>
                <span className="text-lg font-black">{(data?.assignmentsTotal || 0) - (data?.submissionsDone || 0)}</span>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
