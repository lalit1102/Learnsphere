import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ExamInput: A context-aware text input for SHORT_ANSWER assessment questions.
 */
const ExamInput = ({
  question: q,
  setAnswers,
  submission,
  answers,
}) => {
  const studentAnswer = submission?.answers.find(
    (a) => a.questionId === q._id,
  )?.answer;

  const handleValueChange = (e) => {
    if (submission) return;
    setAnswers((prev) => ({ ...prev, [q._id]: e.target.value }));
  };

  const isCorrect = studentAnswer?.toLowerCase().trim() === q.correctAnswer?.toLowerCase().trim();

  return (
    <div className="space-y-4 font-geist">
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <FileText className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <Input
          placeholder={submission ? "No answer provided" : "Type your answer here..."}
          value={submission ? studentAnswer || "" : (answers[q._id] || "")}
          onChange={handleValueChange}
          disabled={!!submission}
          className={cn(
            "h-14 pl-11 rounded-2xl font-bold border-2 transition-all",
            submission 
              ? isCorrect 
                ? "bg-emerald-50 border-emerald-500 text-emerald-900 pr-12" 
                : "bg-rose-50 border-rose-500 text-rose-900 pr-12"
              : "border-slate-100 bg-slate-50 focus:bg-white focus:border-indigo-600 focus:ring-0 shadow-xs"
          )}
        />
        {submission && (
           <div className="absolute inset-y-0 right-4 flex items-center">
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 animate-in zoom-in duration-300" />
            ) : (
              <XCircle className="h-5 w-5 text-rose-600 animate-in zoom-in duration-300" />
            )}
           </div>
        )}
      </div>

      {submission && !isCorrect && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-800 animate-in slide-in-from-top-2">
            <p className="text-[10px] uppercase font-black tracking-widest text-indigo-500 mb-1">Pedagogical Correct Answer</p>
            <p className="text-sm font-bold text-indigo-900 dark:text-indigo-100">{q.correctAnswer}</p>
        </div>
      )}
    </div>
  );
};

export default ExamInput;
