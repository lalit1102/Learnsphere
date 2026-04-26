import React from "react";
import { 
  MoreHorizontal, 
  Loader2, 
  Pencil, 
  Trash2, 
  Users,
  School 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomPagination from "@/components/global/CustomPagination";

/**
 * ClassTable: A high-density data grid for managing school sections.
 * Optimized for administrative oversight with active student tracking.
 */
const ClassTable = ({
  data,
  loading,
  onEdit,
  onDelete,
  page,
  setPage,
  totalPages,
  isAdmin,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm font-geist">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
          <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
            <TableHead className="font-bold text-slate-500 py-4 px-6">Class Designation</TableHead>
            <TableHead className="font-bold text-slate-500 py-4">Academic Year</TableHead>
            <TableHead className="font-bold text-slate-500 py-4">Class Teacher</TableHead>
            <TableHead className="font-bold text-slate-500 py-4">Student Capacity</TableHead>
            {isAdmin && <TableHead className="text-right font-bold text-slate-500 py-4 px-6">Management</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                    <span className="text-xs font-medium text-slate-400">Loading registry...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={isAdmin ? 5 : 4}
                className="h-48 text-center text-slate-400 font-medium italic"
              >
                <div className="flex flex-col items-center gap-2">
                   <School className="h-8 w-8 opacity-20 mb-2" />
                   {isAdmin ? "No academic classes synchronized in the current registry." : "No classes assigned by Admin yet."}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((cls) => (
              <TableRow key={cls._id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                <TableCell className="font-bold text-slate-900 dark:text-white py-4 px-6">{cls.name}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400">{cls.academicYear?.name || <span className="text-slate-300 italic">Unassigned</span>}</TableCell>
                <TableCell>
                  {cls.classTeacher ? (
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        {cls.classTeacher.name?.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{cls.classTeacher.name}</span>
                    </div>
                  ) : (
                    <span className="text-slate-300 italic text-sm">Not Appointed</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <Users className="h-3 w-3" />
                        {cls.studentCount || 0} / {cls.capacity}
                    </div>
                    <div className="flex-1 max-w-[60px] h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${Math.min(((cls.studentCount || 0) / cls.capacity) * 100, 100)}%` }}
                        />
                    </div>
                  </div>
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right px-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-xl border-slate-100 dark:border-slate-800">
                        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Section Registry</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(cls)} className="rounded-xl px-3 py-2 cursor-pointer transition-colors focus:bg-indigo-50 dark:focus:bg-indigo-900/30 focus:text-indigo-600">
                          <Pencil className="mr-2 h-4 w-4" /> 
                          <span className="font-medium">Modify Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-xl px-3 py-2 cursor-pointer text-red-500 focus:bg-red-50 dark:focus:bg-red-900/30 focus:text-red-600"
                          onClick={() => onDelete(cls._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> 
                          <span className="font-medium">Decommission</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <div className="p-4 bg-slate-50/30 dark:bg-slate-900/10 border-t border-slate-100 dark:border-slate-800">
            <CustomPagination
                loading={loading}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
            />
        </div>
      )}
    </div>
  );
};

export default ClassTable;
