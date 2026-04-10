// import { z } from "zod";

// /**
//  * classFormSchema: Validation rules for class registration and updates.
//  * Correctly maps field IDs to backend requirements.
//  */
// export const classFormSchema = z.object({
//   name: z.string().min(1, "Class designation is required (e.g. Grade 10-A)"),
//   capacity: z.coerce.number().positive("Academic capacity must be greater than 0"),
//   academicYear: z.string().min(1, "Select an active academic year"),
//   classTeacher: z.string().optional(),
//   subjectIds: z.array(z.string()).default([]),
// });

// /**
//  * subjectSchema: Validation logic for the course catalog.
//  * Enforces strict pedagogical identifiers and teacher mapping.
//  */
// export const subjectSchema = z.object({
//   name: z.string().min(1, "Formal subject name is required"),
//   code: z.string().min(1, "Academic registry code is required"),
//   teacher: z.array(z.string()).default([]),
//   isActive: z.boolean().default(true),
// });
