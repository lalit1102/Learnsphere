import React, { useState } from "react";
import { Search, UserCircle, School, Mail, Loader2, SearchX } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

const ParentSearch = () => {
  const [grNumber, setGrNumber] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!grNumber.trim()) {
      return toast.error("Please enter a GR Number to search");
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const { data } = await api.get(`/users/student-search/${grNumber}`);
      setStudent(data.student);
      toast.success("Student profile synchronized!");
    } catch (error) {
      setStudent(null);
      const msg = error.response?.data?.message || "Student not found";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header section */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Parent Observer Dashboard
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Enter your child's unique GR Number to access their attendance, exam reports, and class information.
        </p>
      </div>

      {/* Search Bar section */}
      <Card className="border-none shadow-2xl shadow-indigo-100/50 dark:shadow-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <Input
                placeholder="Enter GR Number (e.g. GR-2024-001)"
                value={grNumber}
                onChange={(e) => setGrNumber(e.target.value)}
                className="pl-11 h-12 rounded-2xl border-indigo-100 focus-visible:ring-indigo-500"
              />
            </div>
            <Button 
              type="submit" 
              className="h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Track Student"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="font-medium text-slate-400 animate-pulse">Syncing school records...</p>
        </div>
      ) : student ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Profile Card */}
          <Card className="md:col-span-1 rounded-3xl border-none shadow-xl bg-indigo-600 text-white overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                <UserCircle className="h-16 w-16" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">{student.name}</CardTitle>
                <p className="text-indigo-100/80 font-medium">GR: {grNumber}</p>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="md:col-span-2 rounded-3xl border-none shadow-xl bg-white dark:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-lg">Academic Placement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900">
                <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                  <School className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Class</p>
                  <p className="font-bold text-lg">{student.studentClass?.name || "Pending Placement"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Communication Channel</p>
                  <p className="font-bold text-lg">{student.studentDetails?.parentEmail || student.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : hasSearched && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
          <SearchX className="h-16 w-16 text-slate-300" />
          <p className="text-lg font-medium text-slate-400">No active student record for "{grNumber}"</p>
        </div>
      )}
    </div>
  );
};

export default ParentSearch;
