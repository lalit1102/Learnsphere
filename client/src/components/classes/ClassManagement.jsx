// /**
//  * ROLE-BASED CLASS MANAGEMENT COMPONENTS
//  * =====================================
//  * 
//  * React components for managing classes based on user role
//  * Handles conditional rendering for Admin, Teacher, and Student roles
//  * 
//  * Usage:
//  * import { ClassManager, MyClasses, AdminClassCreation } from '@/components/classes/ClassManagement';
//  * 
//  * <ClassManager />  // Main component - shows role-specific UI
//  */

// "use client";

// import React, { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { api } from "@/lib/api";
// import { useShowFor } from "@/components/auth/roleHelpers";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { AlertCircle, Users, BookOpen, Plus, Trash2 } from "lucide-react";
// import { toast } from "sonner";

// /**
//  * ============================================
//  * ADMIN: CREATE CLASS FORM
//  * ============================================
//  * 
//  * Only admin users see this form
//  * Allows creation of new classes
//  */
// export const AdminClassCreation = ({ onClassCreated }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     academicYear: "",
//     classTeacher: "",
//     capacity: 40,
//     subjects: [],
//   });
//   const [teachers, setTeachers] = useState([]);
//   const [academicYears, setAcademicYears] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // Fetch teachers and academic years
//     const fetchData = async () => {
//       try {
//         const [teachersRes, yearsRes] = await Promise.all([
//           api.get("/users?role=teacher"),
//           api.get("/academic-years"),
//         ]);
//         setTeachers(teachersRes.data.users || []);
//         setAcademicYears(yearsRes.data || []);
//       } catch {
//         toast.error("Failed to fetch form data");
//       }
//     };
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.name || !formData.academicYear) {
//       toast.error("Class name and academic year required");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await api.post("/classes/create", formData);
      
//       if (response.data.success) {
//         toast.success("Class created successfully");
//         setFormData({
//           name: "",
//           academicYear: "",
//           classTeacher: "",
//           capacity: 40,
//           subjects: [],
//         });
//         onClassCreated?.(response.data.class);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to create class");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="border-blue-200 bg-blue-50 dark:bg-slate-900/50">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Plus className="w-5 h-5" />
//           Create New Class
//         </CardTitle>
//         <CardDescription>
//           Add a new class to the system. Only admins can create classes.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Class Name *
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="e.g., Class 10-A"
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Academic Year *
//             </label>
//             <select
//               name="academicYear"
//               value={formData.academicYear}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >
//               <option value="">Select Academic Year</option>
//               {academicYears.map((year) => (
//                 <option key={year._id} value={year._id}>
//                   {year.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Class Teacher (Optional)
//             </label>
//             <select
//               name="classTeacher"
//               value={formData.classTeacher}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Teacher</option>
//               {teachers.map((teacher) => (
//                 <option key={teacher._id} value={teacher._id}>
//                   {teacher.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">
//               Class Capacity
//             </label>
//             <input
//               type="number"
//               name="capacity"
//               value={formData.capacity}
//               onChange={handleChange}
//               min="1"
//               className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
//           >
//             {loading ? "Creating..." : "Create Class"}
//           </button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// /**
//  * ============================================
//  * CLASS CARD COMPONENT
//  * ============================================
//  * 
//  * Displays class information with role-based actions
//  * Admin: Can edit/delete
//  * Teacher: Can manage students (if assigned teacher)
//  * Student: Can view only
//  */
// export const ClassCard = ({
//   classData,
//   onEdit,
//   onDelete,
//   onManageStudents,
//   userRole,
//   isTeacherOfClass,
// }) => {
//   const studentCount = classData.students?.length || 0;
//   const capacity = classData.capacity || 40;

//   return (
//     <Card className="hover:shadow-lg transition-shadow">
//       <CardHeader>
//         <div className="flex items-start justify-between">
//           <div className="flex-1">
//             <CardTitle className="text-lg">{classData.name}</CardTitle>
//             <CardDescription>
//               {classData.academicYear?.name || "Academic Year"}
//             </CardDescription>
//           </div>
//           <Badge variant="outline" className="ml-2">
//             {studentCount}/{capacity}
//           </Badge>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-4">
//         {/* Class Teacher */}
//         {classData.classTeacher && (
//           <div className="flex items-center gap-2 text-sm">
//             <BookOpen className="w-4 h-4 text-blue-600" />
//             <span>Teacher: {classData.classTeacher.name}</span>
//           </div>
//         )}

//         {/* Students */}
//         <div className="flex items-center gap-2 text-sm">
//           <Users className="w-4 h-4 text-green-600" />
//           <span>
//             {studentCount} Student{studentCount !== 1 ? "s" : ""}
//           </span>
//         </div>

//         {/* Capacity */}
//         <div className="w-full bg-gray-200 rounded-full h-2">
//           <div
//             className="bg-blue-600 h-2 rounded-full transition-all"
//             style={{ width: `${(studentCount / capacity) * 100}%` }}
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-2 pt-2">
//           {/* Admin: Edit and Delete buttons */}
//           {userRole === "admin" && (
//             <>
//               <button
//                 onClick={() => onEdit?.(classData._id)}
//                 className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded text-sm transition"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => onDelete?.(classData._id)}
//                 className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </>
//           )}

//           {/* Teacher (assigned): Can manage students */}
//           {userRole === "teacher" && isTeacherOfClass && (
//             <button
//               onClick={() => onManageStudents?.(classData._id)}
//               className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition"
//             >
//               Manage Students
//             </button>
//           )}

//           {/* Student: View details only */}
//           {userRole === "student" && (
//             <button className="flex-1 bg-gray-400 text-white px-3 py-2 rounded text-sm cursor-not-allowed">
//               Your Class
//             </button>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// /**
//  * ============================================
//  * MY CLASSES: TEACHER VIEW
//  * ============================================
//  * 
//  * Shows only classes taught by the teacher
//  * Allows managing students in those classes
//  */
// export const TeacherClasses = () => {
//   const { user } = useAuth();
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [, setError] = useState(null);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get("/classes");
        
//         if (response.data.success) {
//           setClasses(response.data.classes || []);
//         }
//       } catch {
//         setError("Failed to fetch classes");
//         toast.error("Failed to load classes");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClasses();
//   }, []);

//   if (loading)
//     return <div className="text-center py-8">Loading classes...</div>;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
//           My Classes
//         </h2>
//         <p className="text-gray-600 dark:text-gray-400">
//           Classes you are assigned to teach
//         </p>
//       </div>

//       {classes.length === 0 ? (
//         <Card className="bg-yellow-50 border-yellow-200">
//           <CardContent className="pt-6 flex items-center gap-3">
//             <AlertCircle className="w-5 h-5 text-yellow-600" />
//             <p className="text-yellow-800">
//               You haven't been assigned to any classes yet.
//             </p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {classes.map((cls) => (
//             <ClassCard
//               key={cls._id}
//               classData={cls}
//               userRole="teacher"
//               isTeacherOfClass={cls.classTeacher?._id === user?._id}
//               onManageStudents={(classId) => {
//                 toast.success("Navigate to manage students for class " + classId);
//                 // TODO: Navigate to student management page
//               }}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /**
//  * ============================================
//  * MY CLASS: STUDENT VIEW
//  * ============================================
//  * 
//  * Shows only the student's assigned class
//  * Displays class info, teacher, and classmates
//  */
// export const StudentClass = () => {
//   const { student } = useShowFor();
//   const [classData, setClassData] = useState(null);
//   const [classmates, setClassmates] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!student) return;

//     const fetchClass = async () => {
//       try {
//         const response = await api.get("/classes");

//         if (response.data.success && response.data.classes.length > 0) {
//           const userClass = response.data.classes[0]; // Student has only one class
//           setClassData(userClass);
//           setClassmates(userClass.students || []);
//         }
//       } catch {
//         toast.error("Failed to load class information");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClass();
//   }, [student]);

//   if (!student) return null;

//   if (loading) return <div className="text-center py-8">Loading...</div>;

//   if (!classData) {
//     return (
//       <Card className="bg-blue-50 border-blue-200">
//         <CardContent className="pt-6 flex items-center gap-3">
//           <AlertCircle className="w-5 h-5 text-blue-600" />
//           <p className="text-blue-800">You haven't been assigned a class yet.</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Class Overview */}
//       <Card className="border-blue-200 bg-linear-to-r from-blue-50 to-indigo-50 dark:bg-slate-900">
//         <CardHeader>
//           <CardTitle className="text-2xl">{classData.name}</CardTitle>
//           <CardDescription>
//             {classData.academicYear?.name || "Academic Year"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {classData.classTeacher && (
//             <div className="flex items-center gap-3 p-3 bg-white rounded-lg dark:bg-slate-800">
//               <BookOpen className="w-5 h-5 text-blue-600" />
//               <div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Class Teacher
//                 </p>
//                 <p className="font-semibold">
//                   {classData.classTeacher.name}
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="flex items-center gap-3 p-3 bg-white rounded-lg dark:bg-slate-800">
//             <Users className="w-5 h-5 text-green-600" />
//             <div>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 Classmates
//               </p>
//               <p className="font-semibold">{classmates.length} students</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Classmates List */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Classmates</CardTitle>
//           <CardDescription>
//             Students in your class ({classmates.length})
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2 max-h-64 overflow-y-auto">
//             {classmates.map((mate) => (
//               <div
//                 key={mate._id}
//                 className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded"
//               >
//                 <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-bold">
//                   {mate.name.charAt(0)}
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-medium text-sm">{mate.name}</p>
//                   <p className="text-xs text-gray-500">{mate.email}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// /**
//  * ============================================
//  * ALL CLASSES: ADMIN VIEW
//  * ============================================
//  * 
//  * Shows all classes in the system
//  * Admin can create, edit, delete, and manage
//  */
// export const AdminAllClasses = () => {
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/classes?search=${searchTerm}`);
//         if (response.data.success) {
//           setClasses(response.data.classes || []);
//         }
//       } catch {
//         toast.error("Failed to fetch classes");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const timeoutId = setTimeout(fetchClasses, 300);
//     return () => clearTimeout(timeoutId);
//   }, [searchTerm]);

//   const handleDelete = async (classId) => {
//     if (!window.confirm("Are you sure you want to delete this class?")) return;

//     try {
//       await api.delete(`/classes/${classId}`);
//       setClasses(classes.filter((c) => c._id !== classId));
//       toast.success("Class deleted");
//     } catch {
//       toast.error("Failed to delete class");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
//           All Classes
//         </h2>

//         {/* Search */}
//         <input
//           type="text"
//           placeholder="Search classes..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full px-4 py-2 border rounded-lg mb-4"
//         />
//       </div>

//       {loading ? (
//         <div className="text-center py-8">Loading classes...</div>
//       ) : classes.length === 0 ? (
//         <Card className="bg-gray-50">
//           <CardContent className="pt-6 text-center">
//             <p className="text-gray-600">No classes found</p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {classes.map((cls) => (
//             <ClassCard
//               key={cls._id}
//               classData={cls}
//               userRole="admin"
//               onEdit={() =>
//                 toast("Edit functionality coming soon")
//               }
//               onDelete={handleDelete}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /**
//  * ============================================
//  * MAIN CLASS MANAGER
//  * ============================================
//  * 
//  * Master component that shows role-specific UI
//  */
// export const ClassManager = () => {
//   const { user } = useAuth();
//   const { admin, teacher, student } = useShowFor();

//   if (!user) return <div>Please log in</div>;

//   return (
//     <div className="space-y-8 p-6">
//       {/* ADMIN VIEW */}
//       {admin && (
//         <>
//           <AdminClassCreation />
//           <AdminAllClasses />
//         </>
//       )}

//       {/* TEACHER VIEW */}
//       {teacher && <TeacherClasses />}

//       {/* STUDENT VIEW */}
//       {student && <StudentClass />}
//     </div>
//   );
// };

// export default ClassManager;
