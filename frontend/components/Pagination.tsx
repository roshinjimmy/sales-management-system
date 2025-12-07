"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        disabled={currentPage == 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-3 py-1 rounded-md border ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-black hover:bg-gray-50"
        }`}
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md text-sm ${
            page === currentPage
              ? "bg-black text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage == totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-3 py-1 rounded-md border ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-black hover:bg-gray-50"
        }`}
      >
        Next
      </button>
    </div>
  );
}
