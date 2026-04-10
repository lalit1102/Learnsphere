import React from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * NotFound Page: High-impact error state for non-existent routes.
 * Provides clear recovery options for misplaced users.
 */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 font-geist animate-in fade-in zoom-in duration-500">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Visualization */}
        <div className="relative inline-block">
            <div className="absolute -inset-4 bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl rounded-full" />
            <Ghost className="h-24 w-24 text-indigo-600 dark:text-indigo-400 mx-auto animate-bounce duration-[3000ms] relative z-10" />
            <h1 className="text-9xl font-black text-slate-200 dark:text-slate-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 tracking-tighter">
                404
            </h1>
        </div>

        <div className="space-y-3 pt-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Page Dislocated</h2>
          <p className="text-muted-foreground text-lg max-w-sm mx-auto">
            The resource you are looking for has been moved or decomissioned from our academic registry.
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={() => navigate("/dashboard")}
            className="h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.05] active:scale-95"
          >
            <MoveLeft className="mr-2 h-4 w-4" /> Return to Command Center
          </Button>
        </div>

        {/* System Breadcrumbs */}
        <div className="pt-10 flex items-center justify-center gap-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            <div className="h-2 w-2 rounded-full bg-indigo-500" />
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <div className="h-2 w-2 rounded-full bg-amber-500" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
