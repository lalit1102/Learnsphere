import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";

const ExamRadio = ({ question: q, setAnswers, submission, answers }) => {
  const studentAnswer = submission?.answers.find(
    (a) => a.questionId === q._id
  )?.answer;

  return (
    <RadioGroup
      onValueChange={(val) => {
        if (submission) return;
        setAnswers((prev) => ({ ...prev, [q._id]: val }));
      }}
      value={submission ? studentAnswer : answers[q._id]}
      disabled={!!submission}
    >
      {q.options.map((opt, i) => {
        const isThisOptionCorrect = opt === q.correctAnswer;
        const isThisOptionSelected = opt === studentAnswer;

        let containerStyle =
          "flex items-center space-x-2 p-3 rounded-md border transition-all ";
        let badgeText = "";
        let badgeColor = "";

        if (submission) {
          if (isThisOptionCorrect) {
            containerStyle +=
              "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20";

            if (isThisOptionSelected) {
              badgeText = "(Your Correct Answer)";
              badgeColor = "text-green-700 font-bold";
            } else {
              badgeText = "(Correct Answer)";
              badgeColor = "text-green-600 font-semibold";
            }
          } else if (isThisOptionSelected && !isThisOptionCorrect) {
            containerStyle +=
              "bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20";
            badgeText = "(Your Wrong Choice)";
            badgeColor = "text-red-600 font-bold";
          } else {
            containerStyle += "border-transparent opacity-50";
          }
        } else {
          containerStyle +=
            answers[q._id] === opt
              ? "border-primary bg-primary/5"
              : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800";
        }

        return (
          <div key={i} className={containerStyle}>
            <RadioGroupItem
              value={opt}
              id={`${q._id}-${i}`}
              className={
                submission && isThisOptionCorrect
                  ? "text-green-600 border-green-600"
                  : ""
              }
            />

            <Label
              htmlFor={`${q._id}-${i}`}
              className="cursor-pointer w-full py-1 font-normal flex items-center justify-between"
            >
              <span>{opt}</span>

              {submission && badgeText && (
                <div
                  className={`flex items-center gap-1 text-xs ${badgeColor}`}
                >
                  {isThisOptionCorrect ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  <span>{badgeText}</span>
                </div>
              )}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default ExamRadio;
