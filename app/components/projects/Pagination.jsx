import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-200 text-paragraph hover:bg-primary hover:text-white hover:border-primary"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="hidden sm:flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`w-10 h-10 rounded-lg font-medium transition-all ${
              page === currentPage
                ? "bg-primary text-white"
                : page === "..."
                ? "text-paragraph cursor-default"
                : "bg-white border border-gray-200 text-paragraph hover:bg-primary hover:text-white hover:border-primary"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Mobile Page Indicator */}
      <div className="sm:hidden px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-paragraph">
        Page {currentPage} of {totalPages}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-200 text-paragraph hover:bg-primary hover:text-white hover:border-primary"
        }`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

