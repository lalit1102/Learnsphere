import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import AcademicYearTable from "@/components/academic-year/academic-year-table";
import Search from "@/components/global/Search";
import AcademicYearForm from "@/components/academic-year/AcademicYearForm";
import CustomAlert from "@/components/global/CustomAlert";

/**
 * Main Academic Year management page.
 * Uses modular components for Table and Form.
 */
const AcademicYear = () => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Search & Pagination State ---
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingYear, setEditingYear] = useState(null);

  // Alert States
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /**
   * Fetch Years from API with pagination and search.
   */
  const fetchYears = useCallback(async () => {
    try {
      setLoading(true);

      // Construct Query Params
      const params = new URLSearchParams();
      params.append("page", pageNum.toString());
      params.append("limit", "10");
      if (debouncedSearch) params.append("search", debouncedSearch);

      const { data } = await api.get(`/academic-years?${params.toString()}`);

      // Handle response structure { years: [], pagination: {} }
      if (data.years) {
        setYears(data.years);
        setTotalPages(data.pagination.pages);
      } else {
        setYears([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch academic years");
    } finally {
      setLoading(false);
    }
  }, [pageNum, debouncedSearch]);

  // Trigger fetch when Page or Search changes
  useEffect(() => {
    fetchYears();
  }, [fetchYears]);

  // Debounce Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPageNum(1); // Reset to first page on new search
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleCreate = () => {
    setEditingYear(null);
    setIsFormOpen(true);
  };

  const handleEdit = (year) => {
    setEditingYear(year);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/academic-years/delete/${deletingId}`);
      toast.success("Academic year deleted");
      fetchYears();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setIsAlertOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto font-geist">
      {/* header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Calendar className="h-8 w-8 text-violet-600" />
            Academic Years
          </h1>
          <p className="text-muted-foreground mt-1 text-base">Configuration and lifecycle of your school sessions.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Search search={search} setSearch={setSearch} title="Session name..." />
          <Button 
            onClick={handleCreate}
            className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 dark:shadow-none h-10 px-6 rounded-xl transition-all hover:scale-[1.02] w-full sm:w-auto"
          >
            <Plus className="mr-2 h-5 w-5" /> Add New Session
          </Button>
        </div>
      </div>

      {/* Table Component */}
      <div className="transition-all duration-300">
        <AcademicYearTable
            data={years}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            pageNum={pageNum}
            setPageNum={setPageNum}
            totalPages={totalPages}
        />
      </div>

      <AcademicYearForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingYear}
        onSuccess={fetchYears}
      />

      <CustomAlert
        handleDelete={confirmDelete}
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        title="Delete Academic Year?"
        description="Are you sure you want to delete this session? This will remove all associated logs for this period. This action cannot be undone."
      />
    </div>
  );
};

export default AcademicYear;
