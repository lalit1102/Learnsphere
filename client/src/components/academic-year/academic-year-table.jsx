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
//   DropdownMenuTrigger 
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { 
//   MoreVertical, 
//   Edit2, 
//   Trash2, 
//   Calendar, 
//   CheckCircle2, 
//   AlertCircle 
// } from "lucide-react";
// import CustomPagination from "@/components/global/CustomPagination";

// /**
//  * AcademicYearTable component for listing and managing years.
//  * @param {Object} props
//  * @param {Array} props.data - The list of academic years.
//  * @param {boolean} props.loading - Loading state for the table.
//  * @param {function} props.onEdit - Handler for the edit action.
//  * @param {function} props.onDelete - Handler for the delete action.
//  * @param {number} props.pageNum - Current page number.
//  * @param {function} props.setPageNum - Setter for page number.
//  * @param {number} props.totalPages - Total number of pages.
//  */
// const AcademicYearTable = ({
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
//             <TableHead className="w-[40%] font-bold text-slate-900 dark:text-white">Academic Year</TableHead>
//             <TableHead className="w-[25%] font-bold text-slate-900 dark:text-white">Duration</TableHead>
//             <TableHead className="w-[20%] font-bold text-slate-900 dark:text-white">Status</TableHead>
//             <TableHead className="w-[15%] text-right font-bold text-slate-900 dark:text-white">Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {loading ? (
//             [1, 2, 3, 4, 5].map((i) => (
//               <TableRow key={i}>
//                 <TableCell><Skeleton className="h-10 w-48 rounded-lg" /></TableCell>
//                 <TableCell><Skeleton className="h-6 w-32 rounded-lg" /></TableCell>
//                 <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
//                 <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></TableCell>
//               </TableRow>
//             ))
//           ) : data.length > 0 ? (
//             data.map((year) => (
//               <TableRow key={year._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 border-slate-100 dark:border-slate-800 transition-colors">
//                 <TableCell>
//                   <div className="flex items-center gap-3">
//                     <div className={`p-2 rounded-lg ${year.isCurrent ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-600'}`}>
//                         <Calendar className="h-4 w-4" />
//                     </div>
//                     <span className="font-bold text-slate-900 dark:text-white">{year.name}</span>
//                   </div>
//                 </TableCell>
//                 <TableCell className="text-sm text-slate-500">
//                   {new Date(year.fromYear).toLocaleDateString()} — {new Date(year.toYear).toLocaleDateString()}
//                 </TableCell>
//                 <TableCell>
//                   {year.isCurrent ? (
//                     <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 flex items-center gap-1.5 py-0.5 px-2 font-bold uppercase text-[10px] tracking-wider">
//                       <CheckCircle2 className="h-3 w-3" /> Active
//                     </Badge>
//                   ) : (
//                     <Badge variant="outline" className="text-slate-400 bg-slate-50 border-slate-200 py-0.5 px-2 font-bold uppercase text-[10px] tracking-wider">
//                       Previous
//                     </Badge>
//                   )}
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
//                         <MoreVertical className="h-5 w-5" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-slate-200 dark:border-slate-800 font-medium">
//                       <DropdownMenuItem onClick={() => onEdit(year)} className="flex items-center gap-2 p-2.5 mx-1 rounded-lg">
//                           <Edit2 className="h-4 w-4 text-violet-500" /> Edit Year
//                       </DropdownMenuItem>
//                       {!year.isCurrent && (
//                         <DropdownMenuItem 
//                             onClick={() => onDelete(year._id)} 
//                             className="text-red-600 focus:text-red-600 flex items-center gap-2 p-2.5 mx-1 rounded-lg"
//                         >
//                             <Trash2 className="h-4 w-4" /> Delete Year
//                         </DropdownMenuItem>
//                       )}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </TableCell>
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={4} className="h-64 text-center">
//                 <div className="flex flex-col items-center justify-center space-y-3">
//                   <AlertCircle className="h-10 w-10 text-slate-300" />
//                   <p className="text-slate-500 font-medium italic">No academic years found</p>
//                 </div>
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
      
//       {/* Footer Pagination */}
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

// export default AcademicYearTable;
