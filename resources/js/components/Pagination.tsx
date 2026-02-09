import React from 'react';
import Select from 'react-select';

export interface PaginationProps {
  currentPage: number;
  totalRows: number;
  rowsPerPage: number;
  rowsOptions: { value: number; label: string }[];
  onPageChange: (page: number) => void;
  onRowsChange: (selected: any) => void;
  prevLabel: string;
  nextLabel: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalRows,
  rowsPerPage,
  rowsOptions,
  onPageChange,
  onRowsChange,
  prevLabel,
  nextLabel,
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const renderPagination = () => {
    const pages: (number | string)[] = [];
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages.map((page, idx) =>
      page === '...' ? (
        <span key={idx} className="px-3 py-1 text-gray-500 dark:text-gray-400">
          ...
        </span>
      ) : (
        <button
          key={idx}
          onClick={() => onPageChange(Number(page))}
          className={`px-3 py-1 rounded ${
            currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {page}
        </button>
      )
    );
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700
                    sticky top-[92px] z-10 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <span className="text-gray-700 dark:text-gray-300">Rows per page:</span>
        <div className="w-24 z-20">
          <Select
            options={rowsOptions}
            value={rowsOptions.find((opt) => opt.value === rowsPerPage)}
            onChange={onRowsChange}
            className="text-gray-900 dark:text-white"
            classNamePrefix="select"
            isSearchable={false}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 md:mt-0">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          {prevLabel}
        </button>
        {renderPagination()}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
