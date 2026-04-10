// import { z } from "zod";

// /**
//  * Zod validation schema for Academic Year Form.
//  */
// export const formSchema = z.object({
//   name: z.string().min(1, "Name is required (e.g., 2024-2025)"),
//   fromYear: z.date({ 
//     required_error: "Start date is required",
//     invalid_type_error: "Start date is required" 
//   }),
//   toYear: z.date({ 
//     required_error: "End date is required",
//     invalid_type_error: "End date is required"
//   }),
//   isCurrent: z.boolean().default(false),
// });
