import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/global/CustomInput";
import { CustomSelect } from "@/components/global/CustomSelect";
import { CustomMultiSelect } from "@/components/global/CustomMultiSelect";
import { api } from "@/lib/api";

/**
 * UniversalUserForm for Admin CRUD (Teacher & Student)
 * @param {Object} props
 * @param {'create' | 'update'} props.type
 * @param {'teacher' | 'student'} props.role
 * @param {Object} props.initialData - Existing user data for edit mode
 * @param {function} props.onSuccess - Callback on successful operation
 */
const UniversalUserForm = ({
  type = "create",
  role,
  initialData,
  onSuccess,
  onSubmit: externalSubmit,
  pending,
}) => {
  const isUpdate = type === "update";
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Initialize Form
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contact: "",
      // Role specific
      teacherSubject: [],
      teacherDetails: { designation: "", experience: "" },
      studentClass: "",
      studentDetails: { grNumber: "", parentEmail: "" },
    },
  });

  // Load Context Data (Subjects for Teachers, Classes for Students)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        if (role === "teacher") {
          const { data } = await api.get("/subjects");
          setSubjects(data.subjects || []);
        } else if (role === "student") {
          const { data } = await api.get("/classes");
          setClasses(data.classes || []);
        }
      } catch (error) {
        console.error("Failed to load form options", error);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, [role]);

  // Pre-fill form in update mode
  useEffect(() => {
    if (initialData && isUpdate) {
      reset({
        name: initialData.name || "",
        email: initialData.email || "",
        contact: initialData.contact || "",
        teacherSubject: initialData.teacherSubject?.map(s => s._id || s) || [],
        teacherDetails: initialData.teacherDetails || { designation: "", experience: "" },
        studentClass: initialData.studentClass?._id || initialData.studentClass || "",
        studentDetails: initialData.studentDetails || { grNumber: "", parentEmail: "" },
      });
    }
  }, [initialData, isUpdate, reset]);

  const isLogin = type === "login";

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        // Here we handle the specialized login flow
        if (externalSubmit) await externalSubmit(data);
        return;
      }

      const payload = { ...data, role };
      
      // Remove password if updating and empty
      if (isUpdate && !data.password) {
        delete payload.password;
      }

      if (isUpdate) {
        await api.put(`/users/${initialData._id}`, payload);
        toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} updated successfully`);
      } else {
        await api.post("/users/register", payload);
        toast.success(`New ${role} registered successfully`);
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      const msg = error.response?.data?.message || "Operation failed";
      toast.error(msg);
      console.error(error);
    }
  };

  const subjectOptions = subjects.map(s => ({ label: s.name, value: s._id }));
  const classOptions = classes.map(c => ({ label: c.name, value: c._id }));

  if (isLogin) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2 text-center mb-6">
          <h1 className="text-2xl font-black">Login to Learnsphere</h1>
          <p className="text-sm text-muted-foreground font-medium">Enter your credentials to access your registry.</p>
        </div>
        <CustomInput
          control={control}
          name="email"
          label="Email Address"
          type="email"
          placeholder="admin@learnsphere.com"
          rules={{ required: "Email is required" }}
        />
        <CustomInput
          control={control}
          name="password"
          label="Secret Key (Password)"
          type="password"
          placeholder="********"
          rules={{ required: "Password is required" }}
        />
        <Button type="submit" className="w-full h-12 rounded-2xl font-bold bg-slate-900 text-white shadow-xl shadow-slate-200" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Authorize & Enter"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          control={control}
          name="name"
          label="Full Name"
          placeholder="e.g. John Doe"
          rules={{ required: "Name is required" }}
        />
        <CustomInput
          control={control}
          name="email"
          label="Email Address"
          type="email"
          placeholder="user@learnsphere.com"
          disabled={isUpdate}
          rules={{ required: "Email is required" }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          control={control}
          name="contact"
          label="Contact Number"
          placeholder="+91..."
        />
        {!isUpdate && (
          <CustomInput
            control={control}
            name="password"
            label="Initial Password"
            type="password"
            placeholder="Min 8 characters"
            rules={{ required: "Password is required for new users" }}
          />
        )}
      </div>

      {/* Teacher Specific Fields */}
      {role === "teacher" && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-sm font-bold uppercase text-slate-400">Teacher Details</h3>
          <CustomMultiSelect
            control={control}
            name="teacherSubject"
            label="Assigned Subjects"
            placeholder="Select subjects..."
            options={subjectOptions}
            loading={loadingOptions}
          />
          <CustomInput
            control={control}
            name="teacherDetails.designation"
            label="Designation"
            placeholder="e.g. Senior HOD"
          />
        </div>
      )}

      {/* Student Specific Fields */}
      {role === "student" && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-sm font-bold uppercase text-slate-400">Student Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect
              control={control}
              name="studentClass"
              label="Assigned Class"
              placeholder="Select class"
              options={classOptions}
              loading={loadingOptions}
            />
            <CustomInput
              control={control}
              name="studentDetails.grNumber"
              label="GR Number"
              placeholder="Unique registry no."
            />
          </div>
          <CustomInput
            control={control}
            name="studentDetails.parentEmail"
            label="Parent Email"
            type="email"
            placeholder="Emergency contact email"
          />
        </div>
      )}

      <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Synchronizing...
          </>
        ) : (
          isUpdate ? "Update Profile" : `Register ${role}`
        )}
      </Button>
    </form>
  );
};

export default UniversalUserForm;