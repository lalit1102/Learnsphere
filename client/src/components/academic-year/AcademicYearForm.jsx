// import React, { useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
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
// import { Checkbox } from "@/components/ui/checkbox";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import {
//   Field,
//   FieldError,
//   FieldGroup,
//   FieldLabel,
// } from "@/components/ui/field";
// import { CustomInput } from "@/components/global/CustomInput";
// import { api } from "@/lib/api";
// import { formSchema } from "./schema";

// /**
//  * AcademicYearForm component for creating and editing years.
//  * @param {Object} props
//  * @param {boolean} props.open - Whether the dialog is open.
//  * @param {function} props.onOpenChange - Handler for dialog state changes.
//  * @param {Object|null} props.initialData - Initial data for editing.
//  * @param {function} props.onSuccess - Callback on successful submission.
//  */
// const AcademicYearForm = ({
//   open,
//   onOpenChange,
//   initialData,
//   onSuccess,
// }) => {
//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       isCurrent: false,
//     },
//   });

//   // Reset form when dialog opens or data changes
//   useEffect(() => {
//     if (initialData) {
//       form.reset({
//         name: initialData.name,
//         fromYear: new Date(initialData.fromYear),
//         toYear: new Date(initialData.toYear),
//         isCurrent: initialData.isCurrent,
//       });
//     } else {
//       form.reset({
//         name: "",
//         fromYear: undefined,
//         toYear: undefined,
//         isCurrent: false,
//       });
//     }
//   }, [initialData, form, open]);

//   const onSubmit = async (data) => {
//     try {
//       if (initialData) {
//         await api.patch(`/academic-years/update/${initialData._id}`, data);
//         toast.success("Academic year updated");
//       } else {
//         await api.post("/academic-years/create", data);
//         toast.success("Academic year created");
//       }
//       onSuccess();
//       onOpenChange(false);
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to save academic year");
//     }
//   };

//   const pending = form.formState.isSubmitting;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>
//             {initialData ? "Edit Year" : "New Academic Year"}
//           </DialogTitle>
//           <DialogDescription>
//             Set the duration for this session.
//           </DialogDescription>
//         </DialogHeader>
        
//         <form onSubmit={form.handleSubmit(onSubmit)}>
//           <FieldGroup className="space-y-4 pt-4">
//             {/* Name Field */}
//             <CustomInput
//               control={form.control}
//               name="name"
//               label="Year Name"
//               placeholder="e.g. 2026-2027"
//               disabled={pending}
//             />
            
//             {/* date grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* Start Date */}
//               <Controller
//                 name="fromYear"
//                 control={form.control}
//                 render={({ field, fieldState }) => (
//                   <Field data-invalid={fieldState.invalid}>
//                     <FieldLabel>Start Date</FieldLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full pl-3 text-left font-normal border-slate-200 dark:border-slate-800 rounded-xl h-10",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? (
//                             format(field.value, "PPP")
//                           ) : (
//                             <span>Pick a date</span>
//                           )}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar
//                           mode="single"
//                           selected={field.value}
//                           onSelect={field.onChange}
//                           autoFocus
//                           disabled={(date) => date < new Date("1900-01-01")}
//                         />
//                       </PopoverContent>
//                     </Popover>
//                     {fieldState.invalid && (
//                       <FieldError errors={[fieldState.error?.message]} />
//                     )}
//                   </Field>
//                 )}
//               />
              
//               {/* End Date */}
//               <Controller
//                 name="toYear"
//                 control={form.control}
//                 render={({ field, fieldState }) => (
//                   <Field data-invalid={fieldState.invalid}>
//                     <FieldLabel>End Date</FieldLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full pl-3 text-left font-normal border-slate-200 dark:border-slate-800 rounded-xl h-10",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? (
//                             format(field.value, "PPP")
//                           ) : (
//                             <span>Pick a date</span>
//                           )}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar
//                           mode="single"
//                           selected={field.value}
//                           onSelect={field.onChange}
//                           disabled={(date) => {
//                               const fromDate = form.getValues("fromYear");
//                               return fromDate ? date < fromDate : false;
//                           }}
//                           autoFocus
//                         />
//                       </PopoverContent>
//                     </Popover>
//                     {fieldState.invalid && (
//                       <FieldError errors={[fieldState.error?.message]} />
//                     )}
//                   </Field>
//                 )}
//               />
//             </div>
            
//             {/* Checkbox */}
//             <Controller
//               name="isCurrent"
//               control={form.control}
//               render={({ field: { value, onChange, ...field } }) => (
//                 <Field>
//                   <div className="flex items-start gap-3 rounded-xl border border-violet-100 dark:border-violet-900 bg-violet-50/50 dark:bg-violet-900/10 p-4 transition-all">
//                     <Checkbox
//                       id="isCurrent"
//                       checked={value}
//                       onCheckedChange={onChange}
//                       {...field}
//                       className="mt-1 border-violet-300 dark:border-violet-700 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
//                     />
//                     <div className="space-y-1 leading-none">
//                       <FieldLabel
//                         htmlFor="isCurrent"
//                         className="cursor-pointer text-[14px] font-bold text-slate-900 dark:text-white"
//                       >
//                         Set as Active
//                       </FieldLabel>
//                       <p className="text-[12px] text-muted-foreground mt-1">
//                         Automatically deactivates all other years.
//                       </p>
//                     </div>
//                   </div>
//                 </Field>
//               )}
//             />
//           </FieldGroup>
          
//           <DialogFooter className="mt-8">
//             <Button
//               type="submit"
//               disabled={pending}
//               className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 dark:shadow-none h-11 rounded-xl font-bold transition-all hover:scale-[1.01]"
//             >
//               {pending ? "Saving..." : "Save Changes"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default AcademicYearForm;
