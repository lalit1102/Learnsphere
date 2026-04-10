// import React from "react";
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableHeader, 
//   TableRow 
// } from "@/components/ui/table";
// import { 
//   DropdownMenu, 
//   DropdownMenuContent, 
//   DropdownMenuItem, 
//   DropdownMenuTrigger,
//   DropdownMenuLabel,
//   DropdownMenuSeparator
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { 
//   MoreVertical, 
//   Edit2, 
//   Trash2, 
//   BookOpen,
//   Hash,
//   Users,
//   CheckCircle2,
//   AlertCircle
// } from "lucide-react";
// import CustomPagination from "@/components/global/CustomPagination";

// const SubjectTable = ({
//   data = [],
//   loading,
//   onEdit,
//   onDelete,
//   pageNum,
//   setPageNum,
//   totalPages,
// }) => {
//   return (
//     <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden font-geist">
//       <Table>
//         <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
//           <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-800">
//             <TableHead className="w-[35%] font-bold text-slate-900 dark:text-white pl-6">Subject Name</TableHead>
//             <TableHead className="w-[15%] font-bold text-slate-900 dark:text-white">Code</TableHead>
//             <TableHead className="w-[20%] font-bold text-slate-900 dark:text-white">Assigned Teachers</TableHead>
//             <TableHead className="w-[15%] font-bold text-slate-900 dark:text-white">Status</TableHead>
//             <TableHead className="w-[15%] text-right font-bold text-slate-900 dark:text-white pr-6">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {loading ? (
//             [1, 2, 3, 4, 5].map((i) => (
//               <TableRow key={i}>
//                 <TableCell className="pl-6"><Skeleton className="h-10 w-48 rounded-xl" /></TableCell>
//                 <TableCell><Skeleton className="h-6 w-20 rounded-lg" /></TableCell>
//                 <TableCell><Skeleton className="h-6 w-32 rounded-lg" /></TableCell>
//                 <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
//                 <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
//               </TableRow>
//             ))
//           ) : data.length > 0 ? (
//             data.map((subject) => (
//               <TableRow key={subject._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 border-slate-100 dark:border-slate-800 transition-colors">
//                 <TableCell className="pl-6">
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
//                         <BookOpen className="h-5 w-5" />
//                     </div>
//                     <span className="font-bold text-slate-900 dark:text-white text-base">{subject.name}</span>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-400">
//                     <Hash className="h-3.5 w-3.5 text-slate-400" />
//                     {subject.code}
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     <div className="flex -space-x-2">
//                         {[1, 2, 3].slice(0, Math.min(subject.teacher?.length || 0, 3)).map((_, i) => (
//                             <div key={i} className="h-6 w-6 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
//                                 <Users className="h-3 w-3 text-slate-500" />
//                             </div>
//                         ))}
//                     </div>
//                     <span className="text-xs font-medium text-slate-500">
//                         {subject.teacher?.length || 0} Teachers
//                     </span>
//                   </div>
//                 </TableCell>
//                 <TableCell>
//                   {subject.isActive ? (
//                     <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 py-0.5 px-2.5 font-bold uppercase text-[10px] tracking-wider rounded-lg">
//                       <CheckCircle2 className="h-3 w-3 mr-1" /> Active
//                     </Badge>
//                   ) : (
//                     <Badge variant="outline" className="text-slate-400 bg-slate-50 border-slate-200 py-0.5 px-2.5 font-bold uppercase text-[10px] tracking-wider rounded-lg">
//                       Inactive
//                     </Badge>
//                   )}
//                 </TableCell>
//                 <TableCell className="text-right pr-6">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
//                         <MoreVertical className="h-5 w-5" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-52 rounded-2xl shadow-xl border-slate-200 dark:border-slate-800 p-2">
//                       <DropdownMenuLabel className="text-xs font-bold uppercase text-slate-400 px-3 py-2">Management</DropdownMenuLabel>
//                       <DropdownMenuItem onClick={() => onEdit(subject)} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
//                           <Edit2 className="h-4 w-4 text-indigo-500" /> 
//                           <span className="font-bold">Modify Subject</span>
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
//                       <DropdownMenuItem 
//                         onClick={() => onDelete(subject._id)} 
//                         className="text-red-600 focus:text-red-600 flex items-center gap-3 p-3 rounded-xl cursor-pointer"
//                       >
//                           <Trash2 className="h-4 w-4" /> 
//                           <span className="font-bold">Permanently Remove</span>
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={5} className="h-64 text-center">
//                 <div className="flex flex-col items-center justify-center space-y-4">
//                   <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full">
//                     <BookOpen className="h-10 w-10 text-slate-300" />
//                   </div>
//                   <div className="space-y-1">
//                     <p className="text-lg font-bold text-slate-900 dark:text-white">Subject Registry Empty</p>
//                     <p className="text-sm text-slate-500 max-w-xs mx-auto">Start cataloging your educational offerings to begin assignments.</p>
//                   </div>
//                 </div>
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
      
//       <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
//           <CustomPagination 
//             loading={loading}
//             page={pageNum}
//             setPage={setPageNum}
//             totalPages={totalPages}
//           />
//       </div>
//     </div>
//   );
// };

// export default SubjectTable;
