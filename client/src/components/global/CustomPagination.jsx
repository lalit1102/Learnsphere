import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * CustomPagination component for simple previous/next navigation
 * @param {Object} props
 * @param {boolean} props.loading
 * @param {number} props.page
 * @param {function} props.setPage
 * @param {number} props.totalPages
 */
const CustomPagination = ({
  loading,
  page,
  setPage,
  totalPages,
}) => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4 px-6 border-t font-geist">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1 || loading}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      <div className="text-sm font-medium">
        Page {page} of {totalPages}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages || loading}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default CustomPagination;
