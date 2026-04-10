import React, { useState } from "react";
import { Sparkles, RefreshCw, Lightbulb, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

/**
 * AiInsightWidget component that generates AI insights for the dashboard.
 * @param {Object} props
 * @param {string} props.role - One of 'admin', 'teacher', or 'student'.
 */
export function AiInsightWidget({ role }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    setLoading(true);
    try {
      // Logic for real AI call could go here:
      // const { data } = await api.post('/dashboard/insight', { role });
      // setInsight(data.insight);

      // --- MOCK AI RESPONSE (Simulation) ---
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake delay

      let mockResponse = "";
      if (role === "admin") {
        mockResponse =
          "Analysis complete: Grade 10B has shown a 15% drop in attendance on Fridays. Additionally, Math scores across the high school section have improved by 5% compared to last term.";
      } else if (role === "teacher") {
        mockResponse =
          "Observation: 3 students in your History class (John, Sarah, Mike) scored below 40% in the last 2 quizzes. I suggest assigning them the remedial 'World War II' reading material.";
      } else if (role === "student") {
        mockResponse =
          "Study Tip: Your Physics exam is in 3 days. Based on your quiz results, you should focus on 'Thermodynamics'. I've highlighted 2 key chapters for you in the Library.";
      } else {
        mockResponse = "System is running smoothly. No critical alerts found.";
      }

      setInsight(mockResponse);
    } catch (e) {
      toast.error("Could not generate insight");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-linear-to-br from-violet-50 to-white border border-violet-100 dark:from-violet-950/20 dark:border-violet-900/50 shadow-sm overflow-hidden relative group">
      {/* Decorative Background Icon */}
      <BrainCircuit className="absolute -right-6 -bottom-6 h-32 w-32 text-violet-200/30 dark:text-violet-800/10 transition-transform group-hover:scale-110 duration-700" />

      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <CardTitle className="text-md font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> AI Academic Advisor
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-violet-600 hover:text-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/50"
          onClick={generateInsight}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="relative z-10">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        ) : insight ? (
          <div className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {insight}
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Tap to analyze attendance, grades, and schedules for smart insights.
            </p>
            <Button 
                size="sm" 
                onClick={generateInsight}
                className="bg-violet-600 hover:bg-violet-700 text-white border-0 shadow-lg shadow-violet-200 dark:shadow-none"
            >
              Analyze & Generate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
