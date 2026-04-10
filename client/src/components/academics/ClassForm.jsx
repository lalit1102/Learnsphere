// import React, { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";

// import { api } from "@/lib/api";
// import { classFormSchema } from "./schema";

// // UI Imports
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Field,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import { CustomInput } from "@/components/global/CustomInput";
// import { CustomSelect } from "@/components/global/CustomSelect";
// import { CustomMultiSelect } from "@/components/global/CustomMultiSelect";
// import Modal from "@/components/global/Modal";

// /**
//  * ClassForm: Unified modal interface for creating and updating school classes.
//  * Manages complex registrations including faculty assignment and subject mapping.
//  */
// const ClassForm = ({ open, onOpenChange, initialData, onSuccess }) => {
//   const [teachers, setTeachers] = useState([]);
//   const [years, setYears] = useState([]);
//   const [loadingOptions, setLoadingOptions] = useState(false);
//   const [loadingSubjects, setLoadingSubjects] = useState(false);
//   const [subjects, setSubjects] = useState([]);

//   // Fetch contextual options (Teachers and Academic Years)
//   useEffect(() => {
//     if (open) {
//       const fetchData = async () => {
//         setLoadingOptions(true);
//         try {
//           const [teachersRes, yearsRes] = await Promise.all([
//             api.get("/users?role=teacher"),
//             api.get("/academic-years"),
//           ]);
//           setTeachers(teachersRes.data.users || []);
//           setYears(yearsRes.data.years || []);
//         } catch {
//           toast.error("Failed to load school registries");
//         } finally {
//           setLoadingOptions(false);
//         }
//       };
//       fetchData();
//     }
//   }, [open]);

//   // Fetch available Subjects
//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         setLoadingSubjects(true);
//         const { data } = await api.get("/subjects");
//         setSubjects(data.subjects || []);
//       } catch {
//         toast.error("Failed to load curriculum subjects");
//       } finally {
//         setLoadingSubjects(false);
//       }
//     };
//     fetchSubjects();
//   }, []);

//   // Form Initialization
//   const form = useForm({
//     resolver: zodResolver(classFormSchema),
//     defaultValues: {
//       name: "",
//       capacity: 40,
//       academicYear: "",
//       classTeacher: "",
//       subjectIds: [],
//     },
//   });

//   // Reset/Populate form state based on initialData
//   useEffect(() => {
//     if (open) {
//       if (initialData) {
//         form.reset({
//           name: initialData.name || "",
//           capacity: initialData.capacity || 40,
//           academicYear: initialData.academicYear?._id || "",
//           classTeacher: initialData.classTeacher?._id || "",
//           subjectIds: initialData.subjects?.map((s) => (typeof s === "object" && s._id ? s._id : s)) || [],
//         });
//       } else {
//         form.reset({
//           name: "",
//           capacity: 40,
//           academicYear: "",
//           classTeacher: "",
//           subjectIds: [],
//         });
//       }
//     }
//   }, [initialData, form, open]);

//   /**
//    * Handle Form Submission for both Creation and Updates.
//    */
//   const onSubmit = async (data) => {
//     try {
//       const payload = {
//         ...data,
//         classTeacher:
//           data.classTeacher === "unassigned" || data.classTeacher === ""
//             ? null
//             : data.classTeacher,
//         subjects: data.subjectIds,
//       };

//       if (initialData) {
//         await api.patch(`/classes/update/${initialData._id}`, payload);
//         toast.success("Class synchronization successful");
//       } else {
//         await api.post("/classes/create", payload);
//         toast.success("New class registry created");
//       }

//       onSuccess();
//       onOpenChange(false);
//     } catch {
//       toast.error("Failed to finalize class registry");
//     }
//   };

//   const isPending = form.formState.isSubmitting;

//   // Option Mappings for Select components
//   const yearOptions = years.map((y) => ({ label: y.name, value: y._id }));
//   const subjectOptions = subjects.map((s) => ({ label: s.name, value: s._id }));
//   const teachersOptions = teachers.map((t) => ({ label: t.name, value: t._id }));

//   return (
//     <Modal
//       open={open}
//       setOpen={onOpenChange}
//       title={initialData ? "Refine Class Registry" : "Establish New Class"}
//       description={initialData ? "Update class parameters and faculty assignments." : "Provision a new academic section within the system."}
//     >
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
//         <FieldGroup className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <CustomInput
//               control={form.control}
//               name="name"
//               label="Section Name"
//               placeholder="e.g. Grade 10-A"
//               disabled={isPending}
//             />
//             <CustomSelect
//               control={form.control}
//               name="academicYear"
//               label="Academic Session"
//               placeholder="Select Year"
//               options={yearOptions}
//               disabled={isPending}
//               loading={loadingOptions}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <CustomSelect
//               control={form.control}
//               name="classTeacher"
//               label="Assigned Faculty"
//               placeholder="Select Class Teacher"
//               options={teachersOptions}
//               disabled={isPending}
//               loading={loadingOptions}
//             />
//             <Controller
//               name="capacity"
//               control={form.control}
//               render={({ field, fieldState }) => (
//                 <Field data-invalid={fieldState.invalid}>
//                   <FieldLabel htmlFor="capacity">Max Capacity</FieldLabel>
//                   <Input
//                     id="capacity"
//                     type="number"
//                     {...field}
//                     className="h-11 rounded-xl shadow-sm border-slate-200 dark:border-slate-800 focus:ring-indigo-500"
//                   />
//                   {fieldState.invalid && (
//                     <FieldError className="text-xs text-red-500 mt-1">
//                       {fieldState.error?.message}
//                     </FieldError>
//                   )}
//                 </Field>
//               )}
//             />
//           </div>

//           <CustomMultiSelect
//             control={form.control}
//             name="subjectIds"
//             label="Curriculum Subjects"
//             placeholder="Search and map subjects..."
//             options={subjectOptions}
//             loading={loadingSubjects}
//             disabled={isPending}
//           />
//         </FieldGroup>

//         <Button
//           className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
//           type="submit"
//           disabled={isPending}
//         >
//           {isPending ? (
//             <div className="flex items-center gap-2">
//               <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//               Synchronizing...
//             </div>
//           ) : (
//             initialData ? "Commit Updates" : "Create Registry"
//           )}
//         </Button>
//       </form>
//     </Modal>
//   );
// };

// export default ClassForm;
