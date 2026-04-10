// "use client";

// import React, { useState } from "react";
// import { api } from "@/lib/api";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { CheckCircle, Loader, AlertCircle } from "lucide-react";
// import { toast } from "sonner";

// export const TeacherRequestForm = ({ onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     qualifications: {
//       degree: "",
//       specialization: "",
//     },
//     experience: 0,
//     contact: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name.includes(".")) {
//       const [parent, child] = name.split(".");
//       setFormData((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // ✅ validation
//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.password ||
//       !formData.qualifications.degree ||
//       !formData.contact
//     ) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await api.post("/teacher-requests/submit", {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         requestedRole: "teacher",

//         contact: formData.contact,
//         requestedPermissions: [],

//         qualifications: formData.qualifications,
//         experience: formData.experience,
//       });

//       setSubmitted(true);
//       toast.success(response.data.message || "Request submitted successfully!");
//       onSuccess?.();
//     } catch (error) {
//       console.log(error.response?.data); // 🔥 debug
//       toast.error(
//         error.response?.data?.message || "Failed to submit request"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <Card className="w-full max-w-md mx-auto">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2 text-green-600">
//             <CheckCircle className="w-5 h-5" />
//             Request Submitted
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <p className="text-gray-600">
//             Your teacher account request has been submitted successfully!
//           </p>
//           <div className="bg-blue-50 border border-blue-200 rounded p-4">
//             <p className="text-sm text-blue-800">
//               <strong>What happens next?</strong>
//               <br />
//               Admin will review your request and approve your access.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader>
//         <CardTitle>Complete Your Teacher Profile</CardTitle>
//       </CardHeader>

//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">

//           {/* Name */}
//           <input
//             type="text"
//             name="name"
//             placeholder="Enter your name"
//             value={formData.name}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg"
//           />

//           {/* Email */}
//           <input
//             type="email"
//             name="email"
//             placeholder="Enter your email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg"
//           />

//           {/* Password */}
//           <input
//             type="password"
//             name="password"
//             placeholder="Enter password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg"
//           />

//           {/* Degree */}
//           <input
//             type="text"
//             name="qualifications.degree"
//             placeholder="Degree (B.Tech, M.Ed)"
//             value={formData.qualifications.degree}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg"
//           />

//           {/* Specialization */}
//           <input
//             type="text"
//             name="qualifications.specialization"
//             placeholder="Specialization"
//             value={formData.qualifications.specialization}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg"
//           />

//           {/* Experience */}
//           <input
//             type="number"
//             name="experience"
//             placeholder="Experience (years)"
//             value={formData.experience}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg"
//           />

//           {/* Contact */}
//           <input
//             type="tel"
//             name="contact"
//             placeholder="Contact Number"
//             value={formData.contact}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border rounded-lg"
//           />

//           {/* Info */}
//           <div className="bg-yellow-50 border p-2 rounded flex gap-2 text-sm">
//             <AlertCircle className="w-4 h-4 text-yellow-600" />
//             Admin will review your request before approval
//           </div>

//           <Button type="submit" disabled={loading} className="w-full">
//             {loading ? (
//               <>
//                 <Loader className="w-4 h-4 mr-2 animate-spin" />
//                 Submitting...
//               </>
//             ) : (
//               "Submit Request"
//             )}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default TeacherRequestForm;