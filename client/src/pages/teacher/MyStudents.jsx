import React, { useEffect, useState } from "react";
import { Users, Mail, Phone, GraduationCap, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";

const MyStudents = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/users/my-students");
        setData(data);
      } catch (error) {
        toast.error("Failed to load your student roster");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = data?.students?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="text-muted-foreground animate-pulse">Syncing class registry...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
        <div>
          <Badge variant="outline" className="mb-2 border-indigo-200 text-indigo-600 bg-indigo-50/50">
            Education Portal
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Students <span className="text-indigo-600">/</span> {data?.className || "General"}
          </h1>
          <p className="text-muted-foreground mt-1 max-w-lg">
            Manage your assigned classroom and monitor student engagement.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
          />
        </div>
      </div>

      {/* Roster Table */}
      <Card className="rounded-3xl border-none shadow-xl shadow-indigo-100/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50 dark:border-white/5 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Class Roster</CardTitle>
            <CardDescription>{filteredStudents.length} students enrolled in {data?.className}</CardDescription>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-white/5">
              <TableRow className="border-none">
                <TableHead className="pl-6 font-bold uppercase text-[10px] tracking-widest text-slate-400">Student</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Registry ID</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Contact</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-slate-100 group-hover:border-indigo-200 transition-colors">
                        <AvatarImage src={student.profileImage} />
                        <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{student.name}</span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium bg-slate-100 text-slate-600">
                      {student.studentDetails?.grNumber || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <Phone className="h-3 w-3" />
                        {student.contact || "No contact"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Enrolled
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-60 text-center">
                    <div className="flex flex-col items-center justify-center opacity-30 grayscale gap-4">
                       <GraduationCap className="h-16 w-16" />
                       <p className="font-bold text-lg">No students found matching your search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyStudents;
