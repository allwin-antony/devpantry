import React from "react";

/**
 * OpenSourceDataset: UIComponents
 * Component: Accessible React + Tailwind Pagination
 * License: MIT (Free for commercial & personal projects)
 */

export function Pagination({
  currentPage = 1,
  totalPages = 10,
  onPageChange,
}) {
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <nav className="flex justify-center" aria-label="Pagination Navigation">
      <ul className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <li>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            aria-label="Previous page"
            className="inline-flex h-8 items-center justify-center rounded-md px-2.5 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none dark:text-slate-300 dark:hover:bg-slate-800"
          >
            &larr; Prev
          </button>
        </li>

        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <li key={`ellipsis-${index}`} className="px-2 text-slate-400">
                &hellip;
              </li>
            );
          }

          const isCurrent = page === currentPage;
          return (
            <li key={page}>
              <button
                type="button"
                onClick={() => onPageChange && onPageChange(page)}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Page ${page}`}
                className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2 font-medium transition ${
                  isCurrent
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {page}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            aria-label="Next page"
            className="inline-flex h-8 items-center justify-center rounded-md px-2.5 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Next &rarr;
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
