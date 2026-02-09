import React from 'react';
import Select from 'react-select';

export interface FilterFormProps {
  filters: Record<string, any>;
  filterFields: { name: string; placeholder: string }[];
  categoryOptions?: { value: string; label: string }[];
  categoryFieldName?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange?: (selected: any) => void;
  onSearch: (e: React.FormEvent) => void;
  searchButtonLabel: string;
  headerAction?: React.ReactNode; // Tambahan: element di header sebelah kanan
}

const FilterForm: React.FC<FilterFormProps> = ({
  filters,
  filterFields,
  categoryOptions,
  categoryFieldName,
  onInputChange,
  onCategoryChange,
  onSearch,
  searchButtonLabel,
  headerAction,
}) => {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 shadow p-6 sticky top-0 z-20">
      {/* Header */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {searchButtonLabel} {/* Bisa pakai sebagai judul form */}
        </h2>
        {headerAction && <div>{headerAction}</div>}
      </div>

      <form onSubmit={onSearch} className="grid grid-cols-12 gap-4">
        {filterFields.map((field) => (
          <input
            key={field.name}
            type="text"
            name={field.name}
            placeholder={field.placeholder}
            value={filters[field.name]}
            onChange={onInputChange}
            className="col-span-12 lg:col-span-6 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-900"
          />
        ))}

        {categoryOptions?.map((cat) => (
          <div key={cat.field} className="col-span-12 lg:col-span-6">
            <Select
              options={cat.options}
              value={cat.options.find(
                (opt) => opt.value === filters[cat.field]
              )}
              onChange={(selected) =>
                onCategoryChange?.(cat.field, selected)
              }
              classNamePrefix="select"
            />
          </div>
        ))}

        {/* {categoryOptions && categoryFieldName && (
          <div className="col-span-12 lg:col-span-6">
            <Select
              options={categoryOptions}
              value={categoryOptions.find((opt) => opt.value === filters[categoryFieldName])}
              onChange={onCategoryChange}
              className="text-gray-900 dark:text-white"
              classNamePrefix="select"
            />
          </div>
        )} */}

        <div className="col-span-12 flex justify-end mt-4">
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            {searchButtonLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterForm;
