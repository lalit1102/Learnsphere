import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import SubjectTable from "@/components/academics/SubjectTable";
import SubjectForm from "@/components/academics/SubjectForm";
import Search from "@/components/global/Search";
import CustomAlert from "@/components/global/CustomAlert";

/**
 * Subjects Management page.
 * Maintains the directory of academic subjects and assigned instructors.
 */
const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Search & Pagination State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  // Alert States
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /**
   * Fetch Subjects from API.
   */
  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: debouncedSearch
      };

      const { data } = await api.get("/subjects", { params });

      if (data.subjects) {
        setSubjects(data.subjects);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to retrieve subjects catalog");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleCreate = () => {
    setEditingSubject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item) => {
    setEditingSubject(item);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/subjects/${deletingId}`);
      toast.success("Subject removed from registry");
      fetchSubjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove subject");
    } finally {
      setIsAlertOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto font-geist">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center rounded-2xl">
                <BookOpen className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            Academic Subjects
          </h1>
          <p className="text-muted-foreground mt-1 text-base">Maintain your course catalog and manage department-wide educational resources.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Search search={searchTerm} setSearch={setSearchTerm} title="Code or subject name..." />
          <Button 
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 dark:shadow-none h-12 px-6 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto font-bold"
          >
            <Plus className="mr-2 h-6 w-6" /> Create New Course
          </Button>
        </div>
      </div>

      {/* Main Table Interface */}
      <SubjectTable
        data={subjects}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        pageNum={page}
        setPageNum={setPage}
        totalPages={totalPages}
      />

      {/* Form Dialog */}
      <SubjectForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingSubject}
        onSuccess={fetchSubjects}
      />

      {/* Persistence Confirmation */}
      <CustomAlert
        handleDelete={confirmDelete}
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        title="Permanently Remove Subject?"
        description="This action will remove the course from the global catalog. This is an irreversible action that may impact student schedules."
      />
    </div>
  );
};

export default SubjectsPage;
