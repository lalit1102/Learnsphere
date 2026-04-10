import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Upload, Calendar, BookOpen, Users } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/global/CustomInput";
import { CustomSelect } from "@/components/global/CustomSelect";
import { api } from "@/lib/api";

const AssignmentForm = ({ open, onOpenChange, onSuccess }) => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      classId: "",
      subjectId: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [classRes, subjectRes] = await Promise.all([
          api.get("/classes"),
          api.get("/subjects"),
        ]);
        setClasses(classRes.data.classes || []);
        setSubjects(subjectRes.data.subjects || []);
      } catch (error) {
        console.error("Failed to load metadata", error);
      } finally {
        setLoading(false);
      }
    };
    if (open) fetchData();
  }, [open]);

  const onSubmit = async (data) => {
    try {
      if (!file) {
        toast.error("Please select an assignment file");
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("dueDate", data.dueDate);
      formData.append("classId", data.classId);
      formData.append("subjectId", data.subjectId);
      formData.append("assignmentFile", file);

      await api.post("/assignments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Assignment created successfully");
      reset();
      setFile(null);
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create assignment");
    }
  };

  const classOptions = classes.map(c => ({ label: c.name, value: c._id }));
  const subjectOptions = subjects.map(s => ({ label: s.name, value: s._id }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Post New Assignment</DialogTitle>
          <DialogDescription>Distribute study materials and tasks to your class registry.</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <CustomInput
            control={control}
            name="title"
            label="Assignment Title"
            placeholder="e.g. Mid-term Research Project"
            rules={{ required: "Title is required" }}
          />

          <CustomInput
            control={control}
            name="description"
            label="Instructions (Optional)"
            placeholder="Objectives and submission guidelines..."
          />

          <div className="grid grid-cols-2 gap-4">
             <CustomSelect
               control={control}
               name="classId"
               label="Target Class"
               placeholder="Select Class"
               options={classOptions}
               rules={{ required: "Class is required" }}
             />
             <CustomSelect
               control={control}
               name="subjectId"
               label="Subject"
               placeholder="Select Subject"
               options={subjectOptions}
               rules={{ required: "Subject is required" }}
             />
          </div>

          <CustomInput
            control={control}
            name="dueDate"
            label="Deadline"
            type="datetime-local"
            rules={{ required: "Deadline is required" }}
          />

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Attachment</label>
            <div className={`border-2 border-dashed rounded-2xl p-6 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer
              ${file ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200 hover:border-indigo-400'}`}>
              <Upload className={`h-8 w-8 ${file ? 'text-emerald-500' : 'text-slate-400'}`} />
              <p className="text-xs font-medium text-slate-500">
                {file ? file.name : "Click to upload assignment file (PDF/Docs)"}
              </p>
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Broadcast Assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentForm;
