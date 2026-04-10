import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2, FileUp, CheckCircle2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const SubmissionModal = ({ open, onOpenChange, assignment, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to submit");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("assignmentId", assignment._id);
      formData.append("submissionFile", file);

      await api.post("/submissions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Assignment submitted successfully!");
      setFile(null);
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Submit Work</DialogTitle>
          <DialogDescription>
            Uploading for: <span className="text-indigo-600 font-bold">{assignment?.title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
           <div className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all
              ${file ? 'border-indigo-400 bg-indigo-50/10 scale-[1.02]' : 'border-slate-200 hover:border-slate-300'}`}>
              
              {file ? (
                <CheckCircle2 className="h-12 w-12 text-indigo-500 animate-in zoom-in" />
              ) : (
                <FileUp className="h-12 w-12 text-slate-300" />
              )}
              
              <div className="text-center">
                <p className="font-bold text-slate-800 dark:text-white">
                  {file ? file.name : "Choose File"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Support PDF, JPG, DOCX (Max 5MB)"}
                </p>
              </div>

              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={(e) => setFile(e.target.files[0])}
              />
           </div>
        </div>

        <DialogFooter>
          <Button 
            className="w-full h-12 rounded-2xl font-bold" 
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Confirm Submission"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionModal;
