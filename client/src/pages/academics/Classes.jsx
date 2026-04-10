import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import Search from "@/components/global/Search";
import CustomAlert from "@/components/global/CustomAlert";
import ClassTable from "@/components/academics/ClassTable";
import ClassForm from "@/components/academics/ClassForm";

/**
 * Classes Management Page: The centralized hub for orchestrating school sections.
 * Features debounced global search, paginated registries, and unified CRUD operations.
 */
const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  // Dialog & Modal Engagement States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  // Deletion Synchronization States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /**
   * Orchestrate debounced search synchronization (500ms delay).
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPageNum(1); // Reset to primary page on parameter shift
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  /**
   * Fetch Academic Class Registry from backend.
   */
  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", pageNum.toString());
      params.append("limit", "10");
      if (debouncedSearch) params.append("search", debouncedSearch);

      const { data } = await api.get(`/classes?${params.toString()}`);

      // Backend returns { classes: [], pagination: { pages: N } }
      if (data && data.classes) {
        setClasses(data.classes);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error("Failed to fetch class registry", error);
      toast.error("Failed to load school section data");
    } finally {
      setLoading(false);
    }
  }, [pageNum, debouncedSearch]);

  // Trigger data synchronization when parameters shift
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleCreate = () => {
    setEditingClass(null);
    setIsFormOpen(true);
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  /**
   * Confirm and synchronize section decommissioning.
   */
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/classes/delete/${deleteId}`);
      toast.success("Section decommissioned successfully");
      fetchClasses(); 
    } catch {
      toast.error("Failed to remove class registry");
    } finally {
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="p-8 lg:p-10 space-y-10 max-w-7xl mx-auto font-geist">
      {/* HEADER: Strategic Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-500 animate-in fade-in slide-in-from-top-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Academic Sections</h1>
          <p className="text-muted-foreground text-base max-w-xl">
            Orchestrate school grades, faculty mapping, and student occupancy levels across the institution.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:w-auto">
            <Search search={search} setSearch={setSearch} title="Sections" />
          </div>
          {isAdmin && (
            <Button 
                onClick={handleCreate}
                className="w-full sm:w-auto h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02]"
            >
                <Plus className="mr-2 h-4 w-4" /> Provision New Class
            </Button>
          )}
        </div>
      </div>

      {/* REGISTRY: Data visualization grid */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ClassTable
            data={classes}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            page={pageNum}
            setPage={setPageNum}
            totalPages={totalPages}
            isAdmin={isAdmin}
          />
      </div>

      {/* DIALOGS: Registry modification interfaces */}
      <ClassForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingClass}
        onSuccess={fetchClasses}
      />

      <CustomAlert
        handleDelete={confirmDelete}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Decommission Class Section"
        description="Are you sure you want to permanently remove this section? All associated student mappings will need to be re-assigned."
      />
    </div>
  );
};

export default Classes;
