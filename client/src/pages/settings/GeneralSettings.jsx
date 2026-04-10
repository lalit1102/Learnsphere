import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSettings } from "@/provider/SettingsProvider";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/global/CustomInput";
import { Settings2, Building, Mail, Phone, MapPin, Loader2, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const GeneralSettings = () => {
  const { settings, refreshSettings } = useSettings();
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      schoolName: "",
      logoUrl: "",
      contactEmail: "",
      phone: "",
      address: "",
    }
  });

  useEffect(() => {
    if (settings) {
      reset({
        schoolName: settings.schoolName || "",
        logoUrl: settings.logoUrl || "",
        contactEmail: settings.contactEmail || "",
        phone: settings.phone || "",
        address: settings.address || "",
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data) => {
    try {
      setIsSaving(true);
      await api.put("/settings/update", data);
      toast.success("Institutional settings updated successfully");
      await refreshSettings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 lg:p-10 max-w-4xl mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[10px] font-black italic">System Configuration</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Settings2 className="h-10 w-10 text-indigo-500" />
            General Settings
          </h1>
          <p className="text-muted-foreground font-medium italic">Manage global institutional identity and contact information.</p>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden">
        <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-8">
          <CardTitle className="text-xl font-black italic uppercase tracking-widest text-slate-800 dark:text-white flex items-center gap-2">
            <Building className="h-5 w-5 text-indigo-500" />
            Institutional Profile
          </CardTitle>
          <CardDescription className="text-sm font-medium italic">
            These details are displayed globally across the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput 
                control={control} 
                name="schoolName" 
                label="Institution Name" 
                placeholder="e.g. Learnsphere Academy" 
                rules={{ required: "School Name is required" }} 
              />
              <CustomInput 
                control={control} 
                name="logoUrl" 
                label="Logo URL (Optional)" 
                placeholder="https://..." 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput 
                control={control} 
                name="contactEmail" 
                label="Contact Email" 
                placeholder="contact@school.edu" 
                icon={<Mail className="h-4 w-4 text-slate-400" />}
              />
              <CustomInput 
                control={control} 
                name="phone" 
                label="Contact Phone" 
                placeholder="+1 234 567 8900" 
                icon={<Phone className="h-4 w-4 text-slate-400" />}
              />
            </div>

            <CustomInput 
              control={control} 
              name="address" 
              label="Physical Address" 
              placeholder="123 Education Blvd, Learning City" 
              icon={<MapPin className="h-4 w-4 text-slate-400" />}
            />

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={isSaving}
                className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black shadow-xl uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Configuration
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
