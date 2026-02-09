import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';

export interface TableColumn {
  key: string;
  label: string;
}

export interface ActionItem {
  label: string;
  onClick: (row: any) => void;
}

export interface MenuTableProps<T> {
  data: T[];
  columns: TableColumn[];
  noDataLabel: string;
  actions?: ActionItem[];
}

const MenuTable = <T extends Record<string, any>>({
  data,
  columns,
  noDataLabel,
  actions,
}: MenuTableProps<T>) => {

  return (
    <div className="overflow-visible max-h-[500px]"> {/* biar dropdown tidak terpotong */}
      <table className="min-w-full table-auto">
        <thead className="sticky top-0 z-10 bg-blue-500 dark:bg-gray-700">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 text-left text-white">{col.label}</th>
            ))}
            {actions && actions.length > 0 && (
              <th className="px-4 py-2 text-left"></th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2">{row[col.key]}</td>
                ))}

                {actions && actions.length > 0 && (
                  <td className="px-4 py-2">
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <EllipsisVerticalIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                      </Menu.Button>

                      <Transition
                        as="div"  // penting: jangan Fragment
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                        className="absolute right-0 mt-2 w-36 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      >
                        {actions.map((action, i) => (
                          <Menu.Item key={i}>
                            {({ active }) => (
                              <button
                                onClick={() => action.onClick(row)}
                                className={`${
                                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                } w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                              >
                                {action.label}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Transition>
                    </Menu>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions && actions.length > 0 ? 1 : 0)} className="px-4 py-2 text-center text-gray-500 dark:text-gray-400">
                {noDataLabel}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MenuTable;
