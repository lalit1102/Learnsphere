import React, { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Plus, FileText, Clock, Users, Loader2, Download, Send, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ExamGenerator from "@/components/lms/ExamGenerator";
import AssignmentForm from "@/components/lms/AssignmentForm";
import SubmissionModal from "@/components/lms/SubmissionModal";

const Assignments = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";
  
  const [assignments, setAssignments] = useState([]);
  const [aiExams, setAiExams] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [isAiGenOpen, setIsAiGenOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [assignRes, aiRes] = await Promise.all([
        api.get("/assignments"),
        api.get("/exams?type=assignment")
      ]);
      setAssignments(assignRes.data || []);
      setAiExams(aiRes.data || []);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to synchronize assignments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownload = (fileUrl) => {
    // Construct full URL (backend serves from /uploads)
    const url = `http://localhost:5000/${fileUrl}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-sm text-muted-foreground animate-pulse">Syncing Portal...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto font-geist">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Assignments</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Curriculum & Task Management Dashboard
          </p>
        </div>
        {isTeacher && (
          <div className="flex gap-3">
             <Button 
                variant="outline"
                onClick={() => setIsAiGenOpen(true)}
                className="h-11 px-5 rounded-2xl font-bold border-2"
              >
                AI Generator
              </Button>
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02]"
              >
                <Plus className="mr-2 h-4 w-4" /> New Assignment
              </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="standard" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 h-12 rounded-2xl p-1 bg-slate-100/50">
          <TabsTrigger value="standard" className="rounded-xl font-bold">Class Assignments</TabsTrigger>
          <TabsTrigger value="ai" className="rounded-xl font-bold">AI Practice Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((item) => (
              <Card key={item._id} className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden group border border-transparent hover:border-indigo-100 transition-all">
                <CardHeader className="p-8 pb-4">
                   <div className="flex justify-between items-center mb-4">
                      <Badge variant="secondary" className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 border-none font-black text-[10px] uppercase tracking-wider">
                         {item.subject?.name}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-widest">
                         <Clock className="h-3 w-3" /> {new Date(item.dueDate).toLocaleDateString()}
                      </span>
                   </div>
                   <CardTitle className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-indigo-600 transition-colors leading-tight">
                      {item.title}
                   </CardTitle>
                </CardHeader>
                <CardContent className="px-8 space-y-4">
                   <p className="text-slate-500 text-sm line-clamp-2 font-medium">{item.description || "No specific instructions provided."}</p>
                   <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                      <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-indigo-500 shadow-sm">
                         <Users className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Target Group</span>
                         <span className="text-sm font-black text-slate-700 dark:text-slate-200">{item.class?.name}</span>
                      </div>
                   </div>
                </CardContent>
                <CardFooter className="p-8 pt-4 gap-3">
                   <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-2xl border-2 font-bold gap-2"
                    onClick={() => handleDownload(item.fileUrl)}
                   >
                     <Download className="h-4 w-4" /> Material
                   </Button>
                   {!isTeacher && (
                      <Button 
                        className="flex-1 h-12 rounded-2xl font-bold bg-slate-900 text-white gap-2"
                        onClick={() => {
                          setSelectedAssignment(item);
                          setIsSubmitOpen(true);
                        }}
                      >
                         <Send className="h-4 w-4" /> Submit
                      </Button>
                   )}
                   {isTeacher && (
                      <Button 
                        className="flex-1 h-12 rounded-2xl font-bold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 gap-2 border-none"
                        onClick={() => toast.info("Submission tracking is active in the audit console.")}
                      >
                         <CheckCircle className="h-4 w-4" /> {item.submissions?.length || 0} Turned in
                      </Button>
                   )}
                </CardFooter>
              </Card>
            ))}
            {assignments.length === 0 && (
              <div className="col-span-full h-80 border-2 border-dashed rounded-[3rem] border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50">
                 <FileText className="h-16 w-16" />
                 <p className="font-black text-xl italic">The curriculum registry is currently empty.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-8">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiExams.map((exam) => (
                <Card key={exam._id} className="rounded-3xl shadow-lg">
                   <CardHeader>
                      <CardTitle>{exam.title}</CardTitle>
                   </CardHeader>
                   <CardFooter>
                      <Button className="w-full">Launch AI Exam</Button>
                   </CardFooter>
                </Card>
              ))}
           </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ExamGenerator 
        open={isAiGenOpen} 
        onOpenChange={setIsAiGenOpen} 
        onSuccess={fetchData} 
        assessmentType="assignment" 
      />
      
      <AssignmentForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onSuccess={fetchData} 
      />

      <SubmissionModal 
        open={isSubmitOpen} 
        onOpenChange={setIsSubmitOpen} 
        assignment={selectedAssignment}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default Assignments;
