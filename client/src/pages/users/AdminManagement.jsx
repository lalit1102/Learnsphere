import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ShieldAlert, 
  Mail,
  ShieldCheck,
  Clock,
  Loader2,
  Lock,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { CustomInput } from "@/components/global/CustomInput";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

const AdminManagement = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      contact: "",
      isSuperAdmin: false
    }
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admins");
      setAdmins(data || []);
    } catch (error) {
      if (error.response?.status === 403) {
        // Handled by UI check
      } else {
        toast.error("Administrative audit failed");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.isSuperAdmin) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const onSubmit = async (data) => {
    try {
      if (editingAdmin) {
        await api.put(`/admins/${editingAdmin._id}`, data);
        toast.success("Administrative profile successfully synchronized");
      } else {
        await api.post("/admins/enroll", data);
        toast.success("Administrative authorization granted");
      }
      setIsDialogOpen(false);
      setEditingAdmin(null);
      reset();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    reset({
      name: admin.name,
      email: admin.email,
      contact: admin.contact || "",
      isSuperAdmin: admin.isSuperAdmin || false
    });
    setIsDialogOpen(true);
  };

  const toggleSuperStatus = async (id) => {
    try {
      const { data } = await api.put(`/admins/toggle-super/${id}`);
      toast.success(data.message);
      fetchData();
    } catch (error) {
      toast.error("Failed to modify clearance level");
    }
  };

  const toggleActiveStatus = async (id) => {
    try {
      const { data } = await api.put(`/admins/toggle-active/${id}`);
      toast.success(data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to modify access status");
    }
  };

  const filteredAdmins = admins.filter(a => 
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Security Check
  if (!currentUser?.isSuperAdmin) {
    return (
      <div className="h-[80vh] flex items-center justify-center p-8">
        <Card className="max-w-md w-full rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />
           <CardContent className="pt-12 pb-10 text-center space-y-6 relative z-10">
              <div className="h-20 w-20 bg-rose-50 text-rose-500 rounded-3xl mx-auto flex items-center justify-center animate-bounce">
                 <ShieldAlert className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Security Violation</h2>
                 <p className="text-slate-500 font-medium italic">Administrative clearance "Super Admin" is required to access the core governance registry.</p>
              </div>
              <Button 
                variant="outline" 
                className="rounded-xl border-slate-200 font-bold px-8 hover:bg-slate-50 active:scale-95 transition-all"
                onClick={() => navigate("/dashboard")}
              >
                Return to Safety
              </Button>
           </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto space-y-8 font-geist animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-8">
        <div className="space-y-1">
          <Badge variant="outline" className="mb-2 bg-slate-900 text-white border-none uppercase tracking-widest text-[10px] font-black italic">Inner Circle Governance</Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Admin Management</h1>
          <p className="text-muted-foreground font-medium italic">Auditing institutional operations and administrative clearance levels.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search Administrators..." 
                className="pl-10 h-11 rounded-xl bg-white border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <Dialog open={isDialogOpen} onOpenChange={(open) => {
             setIsDialogOpen(open);
             if(!open) { setEditingAdmin(null); reset(); }
           }}>
             <DialogTrigger asChild>
               <Button className="h-11 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-200 transition-all active:scale-95">
                 <ShieldCheck className="h-5 w-5 mr-2" /> Authorize Admin
               </Button>
             </DialogTrigger>
             <DialogContent className="max-w-xl rounded-[2.5rem] p-8 border-none shadow-2xl">
               <DialogHeader className="mb-4">
                 <DialogTitle className="text-2xl font-black italic uppercase">{editingAdmin ? "Edit Administrative Credentials" : "Authorization Protocol"}</DialogTitle>
                 <DialogDescription className="font-medium italic">{editingAdmin ? "Modify institutional control parameters for this entity." : "Granting institutional control to a new administrative entity."}</DialogDescription>
               </DialogHeader>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <CustomInput control={control} name="name" label="Identity" placeholder="Admin Name" rules={{required: true}} />
                    <CustomInput control={control} name="email" label="Official Email" placeholder="admin@school.com" rules={{required: true}} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {!editingAdmin && <CustomInput control={control} name="password" label="Gate Password" type="password" placeholder="********" rules={{required: true}} />}
                    <CustomInput control={control} name="contact" label="Direct Line" placeholder="+1..." />
                 </div>

                 <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic font-medium">
                    <input 
                      type="checkbox" 
                      className="h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      {...control.register("isSuperAdmin")}
                    />
                    <div className="flex flex-col">
                       <span className="text-sm font-black text-slate-900">Grant Super Administrative Clearance</span>
                       <span className="text-[10px] text-slate-500">Allows management of other admins and governance settings.</span>
                    </div>
                 </div>

                 <DialogFooter className="mt-8">
                   <Button type="submit" className="w-full h-12 bg-slate-900 text-white rounded-2xl font-black shadow-xl uppercase tracking-widest">
                      {editingAdmin ? "Synchronize Authorization" : "Authorize Access"}
                   </Button>
                 </DialogFooter>
               </form>
             </DialogContent>
           </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 animate-pulse">
           <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
           <p className="text-sm font-bold text-slate-400 italic">Auditing Administrative Ledger...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
           <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-100 dark:shadow-none bg-white dark:bg-slate-950 overflow-hidden">
             <Table>
               <TableHeader className="bg-slate-50/50 dark:bg-white/5">
                 <TableRow className="border-none">
                   <TableHead className="pl-10 h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Governance Identity</TableHead>
                   <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Clearance Level</TableHead>
                   <TableHead className="h-16 font-black text-[10px] uppercase tracking-widest text-slate-400">Last Active Session</TableHead>
                   <TableHead className="pr-10 h-16 text-right"></TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredAdmins.map((admin) => (
                   <TableRow key={admin._id} className="hover:bg-slate-50/80 transition-colors border-slate-50 dark:border-white/5 group">
                     <TableCell className="pl-10 py-6">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase shadow-xl group-hover:scale-110 transition-transform">
                              {admin.name.charAt(0)}
                           </div>
                           <div className="flex flex-col">
                              <span className="font-black text-slate-800 dark:text-white text-lg tracking-tight leading-tight">{admin.name}</span>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                 <Mail className="h-3 w-3" />
                                 {admin.email}
                              </div>
                           </div>
                        </div>
                     </TableCell>
                     <TableCell>
                        {admin.isSuperAdmin ? (
                          <Badge className="bg-amber-100 text-amber-700 border-none font-black italic tracking-widest text-[9px] px-3">
                             <Zap className="h-3 w-3 mr-1" /> Super Admin
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-600 border-none font-black italic tracking-widest text-[9px] px-3">
                             <Lock className="h-3 w-3 mr-1" /> Administrative
                          </Badge>
                        )}
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-2 font-black text-slate-600 italic text-sm">
                           <Clock className="h-4 w-4 text-slate-300" />
                           {admin.lastLogin ? format(new Date(admin.lastLogin), "MMM d, h:mm a") : "Legacy Account"}
                        </div>
                     </TableCell>
                     <TableCell className="pr-10 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
                              <MoreVertical className="h-5 w-5 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[200px]">
                            <DropdownMenuItem onClick={() => handleEdit(admin)} className="rounded-xl py-3 cursor-pointer">
                              <Edit2 className="h-4 w-4 mr-2" /> <span className="font-bold">Modify Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="rounded-xl py-3 cursor-pointer"
                              disabled={admin.email === "admin@example.com"}
                              onClick={() => toggleSuperStatus(admin._id)}
                            >
                              <ShieldCheck className="h-4 w-4 mr-2" /> 
                              <span className="font-bold">{admin.isSuperAdmin ? "Demote to Admin" : "Elevate to Super"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="rounded-xl py-3 cursor-pointer text-rose-600 focus:text-rose-600"
                              disabled={admin.email === "admin@example.com"}
                              onClick={() => toggleActiveStatus(admin._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> 
                              <span className="font-bold">{admin.isActive ? "Deactivate Account" : "Reactivate Account"}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </Card>
        </div>
      )}

      {!loading && admins.length === 0 && (
        <div className="h-96 border-2 border-dashed rounded-[3.5rem] border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50 bg-white shadow-inner">
           <Zap className="h-20 w-20 stroke-[1.5]" />
           <p className="font-black text-2xl italic tracking-tight uppercase">Governance Registry Unpopulated</p>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
