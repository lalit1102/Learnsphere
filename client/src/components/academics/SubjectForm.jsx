// import React, { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   Field,
//   FieldGroup,
//   FieldLabel
// } from "@/components/ui/field";
// import { Checkbox } from "@/components/ui/checkbox";
// import { CustomInput } from "@/components/global/CustomInput";
// import { CustomMultiSelect } from "@/components/global/CustomMultiSelect";
// import { api } from "@/lib/api";
// import { subjectSchema } from "./schema";

// const SubjectForm = ({
//   open,
//   onOpenChange,
//   initialData,
//   onSuccess,
// }) => {
//   const [teachers, setTeachers] = useState([]);
//   const [loadingTeachers, setLoadingTeachers] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(subjectSchema),
//     defaultValues: {
//       name: "",
//       code: "",
//       teacher: [],
//       isActive: true,
//     },
//   });

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         setLoadingTeachers(true);
//         const { data } = await api.get("/users?role=teacher&limit=100");
//         setTeachers(data.users || []);
//       } catch (error) {
//         console.error("Failed to load teachers", error);
//       } finally {
//         setLoadingTeachers(false);
//       }
//     };

//     if (open) {
//       fetchTeachers();
//     }
//   }, [open]);

//   useEffect(() => {
//     if (initialData) {
//       form.reset({
//         name: initialData.name || "",
//         code: initialData.code || "",
//         teacher: initialData.teacher?.map(t => t._id || t) || [],
//         isActive: initialData.isActive !== undefined ? initialData.isActive : true,
//       });
//     } else {
//       form.reset({
//         name: "",
//         code: "",
//         teacher: [],
//         isActive: true,
//       });
//     }
//   }, [initialData, form, open]);

//   const onSubmit = async (data) => {
//     try {
//       if (initialData) {
//         await api.put(`/subjects/${initialData._id}`, data);
//         toast.success("Subject catalog updated");
//       } else {
//         await api.post("/subjects", data);
//         toast.success("New subject created");
//       }
//       onSuccess();
//       onOpenChange(false);
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to save subject data");
//     }
//   };

//   const teacherOptions = teachers.map(t => ({
//     label: t.name,
//     value: t._id
//   }));

//   const pending = form.formState.isSubmitting;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
//         <div className="bg-indigo-600 p-6 text-white">
//             <DialogHeader>
//                 <DialogTitle className="text-2xl font-bold tracking-tight">
//                     {initialData ? "Refine Subject" : "Catalog New Subject"}
//                 </DialogTitle>
//                 <DialogDescription className="text-indigo-100 mt-1 opacity-90">
//                     Define the name, identifier, and educators for this course.
//                 </DialogDescription>
//             </DialogHeader>
//         </div>
        
//         <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 bg-white dark:bg-slate-950">
//           <FieldGroup className="space-y-6">
//             <div className="grid grid-cols-1 gap-4">
//                 <CustomInput
//                     control={form.control}
//                     name="name"
//                     label="Formal Subject Name"
//                     placeholder="e.g. Theoretical Physics"
//                     disabled={pending}
//                 />
                
//                 <CustomInput
//                     control={form.control}
//                     name="code"
//                     label="Subject Registry Code"
//                     placeholder="e.g. PHY-101"
//                     disabled={pending}
//                 />
//             </div>

//             <CustomMultiSelect 
//                 control={form.control}
//                 name="teacher"
//                 label="Assigned Educators"
//                 placeholder="Facilitate instructor selection..."
//                 options={teacherOptions}
//                 loading={loadingTeachers}
//                 disabled={pending}
//             />

//             <Controller
//               name="isActive"
//               control={form.control}
//               render={({ field: { value, onChange, ...field } }) => (
//                 <Field>
//                   <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-900/10 p-4 transition-all">
//                     <Checkbox
//                       id="isActive"
//                       checked={value}
//                       onCheckedChange={onChange}
//                       {...field}
//                       className="mt-1 border-indigo-300 dark:border-indigo-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 rounded-lg h-5 w-5"
//                     />
//                     <div className="space-y-1">
//                       <FieldLabel
//                         htmlFor="isActive"
//                         className="cursor-pointer text-[14px] font-bold text-slate-800 dark:text-slate-200"
//                       >
//                         Enrollment Active
//                       </FieldLabel>
//                       <p className="text-[12px] text-muted-foreground leading-tight">
//                         Determines if this subject is visible for student course planning.
//                       </p>
//                     </div>
//                   </div>
//                 </Field>
//               )}
//             />
//           </FieldGroup>
          
//           <DialogFooter className="mt-8 flex flex-col sm:flex-col gap-3">
//             <Button
//               type="submit"
//               disabled={pending}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 dark:shadow-none h-12 rounded-2xl font-bold transition-all hover:scale-[1.01] active:scale-[0.98]"
//             >
//               {pending ? "Saving..." : initialData ? "Commit Changes" : "Create Subject"}
//             </Button>
//             <Button 
//                 type="button" 
//                 variant="ghost" 
//                 onClick={() => onOpenChange(false)}
//                 className="w-full h-11 rounded-2xl text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-900"
//                 disabled={pending}
//             >
//                 Cancel
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default SubjectForm;
