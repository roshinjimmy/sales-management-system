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
  const maxButtons = 7;
  const half = Math.floor(maxButtons / 2);

  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (currentPage <= half) {
    end = Math.min(totalPages, maxButtons);
  } else if (currentPage + half >= totalPages) {
    start = Math.max(1, totalPages - maxButtons + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-gray-700">
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="rounded-md border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
          >
            1
          </button>
          <span className="px-1 text-gray-400">...</span>
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium ${
            page === currentPage
              ? "bg-gray-900 text-white"
              : "border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          <span className="px-1 text-gray-400">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="rounded-md border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
          >
            {totalPages}
          </button>
        </>
      )}
    </div>
  );
}
