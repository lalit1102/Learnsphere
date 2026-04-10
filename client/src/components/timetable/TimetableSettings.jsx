import React from "react";
import { useForm } from "react-hook-form";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { CustomInput } from "@/components/global/CustomInput";

/**
 * TimetableSettings: Configuration modal for AI-powered generation.
 * Currently, it collects basic constraints for the scheduling algorithm.
 */
const TimetableSettings = ({
  open,
  onOpenChange,
  onGenerate,
}) => {
  const form = useForm({
    defaultValues: {
      periodsPerDay: 6,
      startTime: "08:30",
      endTime: "14:30",
      periodDuration: 45, // minutes
    },
  });

  const onSubmit = (data) => {
    onGenerate(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-3xl border-none p-0 overflow-hidden shadow-2xl">
        <div className="bg-indigo-600 p-6 text-white text-center">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight">AI Scheduling Config</DialogTitle>
                <DialogDescription className="text-indigo-100 mt-1">
                    Set the boundaries for your academic session for the best AI results.
                </DialogDescription>
            </DialogHeader>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 bg-white dark:bg-slate-950">
            <FieldGroup className="space-y-4">
                <CustomInput
                    control={form.control}
                    name="periodsPerDay"
                    label="Lectures/Periods per Day"
                    type="number"
                    placeholder="6"
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <CustomInput
                        control={form.control}
                        name="startTime"
                        label="School Starts"
                        type="time"
                    />
                    <CustomInput
                        control={form.control}
                        name="endTime"
                        label="School Ends"
                        type="time"
                    />
                </div>

                <CustomInput
                    control={form.control}
                    name="periodDuration"
                    label="Duration per session (min)"
                    type="number"
                    placeholder="45"
                />
            </FieldGroup>

            <DialogFooter className="mt-8 flex flex-col gap-3">
                <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02]"
                >
                    Initiate Smart Generation
                </Button>
                <Button 
                    variant="ghost" 
                    type="button" 
                    onClick={() => onOpenChange(false)}
                    className="w-full rounded-2xl h-10 text-slate-400"
                >
                    Close
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimetableSettings;
