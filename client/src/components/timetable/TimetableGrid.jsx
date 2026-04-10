import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Clock, User as UserIcon, CalendarX2 } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const TimetableGrid = ({ schedule, isLoading }) => {
  // Loading State
  if (isLoading) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center border-2 border-slate-100 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-950/50 shadow-sm font-geist">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
            <div className="h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-500 font-medium animate-pulse">Syncing smart schedule...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!schedule || schedule.length === 0) {
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 font-geist">
        <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <CalendarX2 className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">No Timetable Generated</h3>
        <p className="text-slate-500 font-medium max-w-sm text-center mt-2">
          Select a class and academic year above to calculate or view the weekly schedule.
        </p>
      </div>
    );
  }

  // Time Sorting Logic (Fixed)
  const timeSlots = useMemo(() => {
    if (!schedule) return [];
    const times = new Set();
    schedule.forEach((dayData) => {
      dayData.periods?.forEach((period) => {
        if (period.startTime) times.add(period.startTime);
      });
    });

    // Lexicographical sort works perfectly for zero-padded 24-hr strings (e.g. "08:00", "14:00")
    return Array.from(times).sort();
  }, [schedule]);

  const getRowLabel = (startTime) => {
    for (const day of schedule) {
      const found = day.periods?.find((p) => p.startTime === startTime);
      if (found) {
        return `${found.startTime} - ${found.endTime}`;
      }
    }
    return startTime;
  };

  return (
    <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden font-geist">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max min-w-full flex-col">
          {/* Header Row */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="w-32 shrink-0 border-r border-slate-100 dark:border-slate-800 p-4 font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center justify-center">
              Time
            </div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="flex-1 min-w-[200px] border-r border-slate-100 dark:border-slate-800 p-4 font-bold text-sm text-slate-800 dark:text-slate-200 text-center last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Time Rows */}
          {timeSlots?.map((time) => (
            <div className="flex border-b border-slate-100 dark:border-slate-800 last:border-b-0 min-h-[120px]" key={time}>
              {/* Row Header (Time) */}
              <div className="w-32 shrink-0 border-r border-slate-100 dark:border-slate-800 p-2 text-[11px] font-bold text-slate-500 flex items-center justify-center text-center bg-slate-50 dark:bg-slate-900/50">
                <div className="bg-white dark:bg-slate-950 py-1 px-3 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                  {getRowLabel(time)}
                </div>
              </div>

              {/* Day Columns */}
              {DAYS.map((day) => {
                const dayData = schedule.find((d) => d.day === day);
                const period = dayData?.periods?.find((p) => p.startTime === time);

                return (
                  <div
                    key={`${day}-${time}`}
                    className="flex-1 min-w-[200px] border-r border-slate-100 dark:border-slate-800 p-3 last:border-r-0 bg-white dark:bg-slate-950"
                  >
                    {period && period.subject && period.teacher ? (
                      <div className="h-full w-full rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-linear-to-b from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-950 p-4 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between gap-3 border-l-4 border-l-indigo-500 relative overflow-hidden group">
                        
                        {/* Hover Overlay Gradient */}
                        <div className="absolute inset-0 bg-linear-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="font-black text-[9px] px-2 py-0.5 uppercase tracking-widest bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-md">
                              {period.subject.code || "SUBJ"}
                            </Badge>
                          </div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight">
                            {period.subject.name}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 relative z-10">
                          <div className="h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <UserIcon className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                          </div>
                          <span className="truncate max-w-[130px]">{period.teacher.name}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full w-full rounded-2xl border-2 border-dashed border-emerald-200 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 capitalize tracking-wide flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> Break
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default TimetableGrid;
