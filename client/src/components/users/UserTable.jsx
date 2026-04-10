import React from "react";
import { Badge } from "@/components/ui/badge";
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
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomPagination from "@/components/global/CustomPagination";

/**
 * UserTable component for listing and managing users with role-specific views.
 * @param {Object} props
 */
const UserTable = ({
  role,
  loading,
  setDeleteId,
  setIsDeleteOpen,
  setEditingUser,
  setIsFormOpen,
  pageNum,
  setPageNum,
  users = [],
  totalPages,
}) => {
  const handleEdit = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  return (
    <div className="border rounded-md bg-white dark:bg-slate-950">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            {role === "teacher" && <TableHead>Subjects</TableHead>}
            {role === "student" && <TableHead>Class</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={role === "teacher" || role === "student" ? 4 : 3} className="h-24 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={role === "teacher" || role === "student" ? 4 : 3}
                className="h-24 text-center text-muted-foreground italic"
              >
                No {role}s found in the directory.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="font-medium flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <UserIcon className="h-4 w-4 text-slate-500" />
                  </div>
                  <span className="truncate">{user.name}</span>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                {role === "teacher" && (
                  <TableCell>
                    {user.teacherSubject?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {user.teacherSubject.map((subject) => (
                          <Badge variant="outline" key={subject._id} className="text-[10px] font-bold">
                            {subject.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">
                        Unassigned
                      </span>
                    )}
                  </TableCell>
                )}
                {role === "student" && (
                  <TableCell>
                    {user.studentClass?._id || user.studentClass ? (
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {user.studentClass.name || "Assigned"}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">
                        Unassigned
                      </span>
                    )}
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl shadow-xl w-40">
                      <DropdownMenuLabel className="text-xs font-bold uppercase text-slate-400">Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(user)} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4 text-violet-500" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                        onClick={() => {
                          setDeleteId(user._id);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Pagination footer - only show if there's more than one page or specific criteria */}
      <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/50">
        <CustomPagination
          loading={loading}
          page={pageNum}
          setPage={setPageNum}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default UserTable;
