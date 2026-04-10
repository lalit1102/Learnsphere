import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ShieldAlert, ShieldCheck, Loader2, Edit3, Settings, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";

const AVAILABLE_PERMISSIONS = [
  { id: "manage_users", label: "Manage Users", category: "Core Governance" },
  { id: "manage_academics", label: "Manage Academics", category: "Core Governance" },
  { id: "manage_finance", label: "Manage Finance", category: "Core Governance" },
  { id: "manage_settings", label: "Manage Settings", category: "Core Governance" },
  { id: "view_reports", label: "View Global Reports", category: "Analytics" },
  { id: "view_classes", label: "View Assigned Classes", category: "Instructional" },
  { id: "manage_attendance", label: "Manage Attendance", category: "Instructional" },
  { id: "submit_grades", label: "Submit Grades", category: "Instructional" },
  { id: "view_learning_materials", label: "View Learning Materials", category: "Academic Focus" },
  { id: "submit_assignments", label: "Submit Assignments", category: "Academic Focus" },
  { id: "view_grades", label: "View Personal Grades", category: "Academic Focus" },
  { id: "view_child_reports", label: "View Child Reports", category: "Guardian" },
  { id: "view_fees", label: "View Fee Obligations", category: "Guardian" }
];

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activePermissions, setActivePermissions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { user } = useAuth();
  const isSuperAdmin = user?.isSuperAdmin;

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/roles");
      setRoles(data);
    } catch (error) {
      toast.error("Failed to load institutional roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openPermissionEditor = (role) => {
    if (!isSuperAdmin) {
       toast.error("Exclusive Super Administrator command required.");
       return;
    }
    setSelectedRole(role);
    setActivePermissions([...role.permissions]);
    setIsDialogOpen(true);
  };

  const handleTogglePermission = (permId) => {
    setActivePermissions(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const savePermissions = async () => {
    try {
      if (!isSuperAdmin) return;
      setSaving(true);
      await api.put(`/roles/${selectedRole._id}/permissions`, { permissions: activePermissions });
      toast.success(`${selectedRole.displayName} permissions updated`);
      setIsDialogOpen(false);
      fetchRoles();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  // Group permissions for rendering
  const categories = Array.from(new Set(AVAILABLE_PERMISSIONS.map(p => p.category)));

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-6xl mx-auto space-y-6 md:space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 border-b pb-6 md:pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-indigo-50 text-indigo-600 border-indigo-100 uppercase tracking-widest text-[10px] font-black italic">System Configuration</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldAlert className="h-10 w-10 text-indigo-500" />
            Roles & Permissions
          </h1>
          <p className="text-muted-foreground font-medium italic">Dynamically map system capabilities to user identities.</p>
        </div>
      </div>

      {!isSuperAdmin && (
         <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center gap-3 text-sm font-bold">
            <AlertCircle className="h-5 w-5" />
            Access Restricted: You are viewing this registry in Read-Only Mode. Only Master Governance (Super Admin) can modify permissions.
         </div>
      )}

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-sm font-bold text-slate-400 italic">Syncing Access Matrices...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map(role => (
             <Card key={role._id} className="rounded-[2rem] border-none shadow-xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden flex flex-col">
                <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 p-6 pb-4">
                  <div className="flex justify-between items-start">
                     <div>
                       <Badge className="bg-slate-900 text-white border-none font-bold italic tracking-widest uppercase text-[10px] px-3 pointer-events-none mb-3">
                          System Bound
                       </Badge>
                       <CardTitle className="text-2xl font-black tracking-tight text-slate-800 dark:text-white leading-none mb-2">
                          {role.displayName}
                       </CardTitle>
                       <CardDescription className="text-sm font-medium">
                          {role.description}
                       </CardDescription>
                     </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                   <div className="space-y-4 mb-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Active Capabilities</h4>
                      <div className="flex flex-wrap gap-2">
                         {role.permissions.map(perm => {
                            const detail = AVAILABLE_PERMISSIONS.find(p => p.id === perm);
                            return (
                               <Badge key={perm} variant="outline" className="font-bold text-indigo-700 bg-indigo-50 border-indigo-100 uppercase tracking-tighter text-[9px]">
                                  <ShieldCheck className="h-3 w-3 mr-1" /> {detail?.label || perm}
                               </Badge>
                            )
                         })}
                      </div>
                   </div>
                   <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button 
                        onClick={() => openPermissionEditor(role)}
                        className="w-full h-11 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all"
                      >
                         <Edit3 className="h-4 w-4 mr-2" /> Modify Capabilities
                      </Button>
                   </div>
                </CardContent>
             </Card>
          ))}
        </div>
      )}

      {/* Permission Editor Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent className="max-w-3xl w-[95vw] sm:w-[90vw] max-h-[80vh] flex flex-col rounded-[2rem] p-0 border border-indigo-500/30 shadow-[0_0_50px_-12px_rgba(99,102,241,0.15)] dark:shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)] overflow-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl">
            <div className="p-6 md:p-8 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-white/5">
               <DialogTitle className="text-xl md:text-2xl font-black italic uppercase flex items-center gap-3">
                  <Settings className="h-6 w-6 text-indigo-500" />
                  {selectedRole?.displayName}
               </DialogTitle>
               <DialogDescription className="font-medium mt-1 text-sm">
                  Bind specific systemic capabilities to this identity. Check the modules you want them to access.
               </DialogDescription>
            </div>
            
            <div className="p-5 md:p-6 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
               {categories.map(category => (
                  <div key={category} className="space-y-1">
                     <h3 className="text-[10px] border-b border-slate-100 dark:border-slate-800 pb-1.5 font-black uppercase tracking-widest text-slate-400 italic flex items-center">{category}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {AVAILABLE_PERMISSIONS.filter(p => p.category === category).map(perm => (
                           <div 
                             key={perm.id} 
                             className="flex items-start space-x-3 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors"
                           >
                              <Checkbox 
                                id={`perm-${perm.id}`}
                                checked={activePermissions.includes(perm.id)}
                                onCheckedChange={() => handleTogglePermission(perm.id)}
                                className="mt-0.5 flex-shrink-0"
                              />
                              <div className="space-y-1">
                                 <label 
                                   htmlFor={`perm-${perm.id}`}
                                   className="text-xs font-bold leading-none cursor-pointer text-slate-800 dark:text-slate-200"
                                 >
                                   {perm.label}
                                 </label>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 flex gap-3 justify-end">
               <Button 
                 variant="ghost" 
                 onClick={() => setIsDialogOpen(false)}
                 className="rounded-xl font-bold tracking-widest uppercase text-xs px-6"
               >
                 Cancel
               </Button>
               <Button 
                  onClick={savePermissions}
                  disabled={saving}
                  className="h-11 px-8 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-black shadow-lg shadow-indigo-100 uppercase tracking-widest"
               >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                  Bind Permissions
               </Button>
            </div>
         </DialogContent>
      </Dialog>

    </div>
  );
};

export default Roles;
