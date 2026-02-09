import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';

import Modal from '@/components/Modal';
import FilterForm from '@/components/FilterForm';
import MenuTable, { TableColumn } from '@/components/MenuTable';
import Pagination from '@/components/Pagination';
import { PlusIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';

interface Menu {
  no: number;
  id: number;
  name: string;
  icon: string;
  status: string;
}

interface MenuDetail {
  mmid: number;
  name: string;
  icon: string;
  route: string;
  is_active: boolean;
  is_expandable: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Master Data', href: dashboard().url },
];

const categoryOptions = [
  { value: '', label: 'Semua' },
  { value: 'true', label: 'Aktif' },
  { value: 'false', label: 'Non-Aktif' },
];

const rowsOptions = [
  { value: 5, label: '5 rows' },
  { value: 10, label: '10 rows' },
  { value: 20, label: '20 rows' },
];

const tableColumns: TableColumn[] = [
  { key: 'no', label: 'No.' },
  { key: 'name', label: 'Nama Menu' },
  { key: 'icon', label: 'Icon' },
  { key: 'status', label: 'Status' },
];

export default function MainMenuList() {
  const [filters, setFilters] = useState({ name: '', category: '' });
  const [data, setData] = useState<Menu[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editRow, setEditRow] = useState<MenuDetail | null>(null);

  const [formValues, setFormValues] = useState({
    name: '',
    icon: '',
    route_name: '',
    is_active: false,
    is_expandable: false,
  });
  

  const fetchData = async (overrideParams: any = {}) => {
    try {
      const queryParams = {
        ...filters,
        page: currentPage,
        per_page: rowsPerPage,
        ...overrideParams,
      };
      const query = new URLSearchParams(queryParams).toString();
      const res = await fetch(`/list_menu?${query}`);
      if (!res.ok) throw new Error('Gagal mengambil data');
      const json = await res.json();
      const mappedData = json.data.map((item: any) => ({
        no: item.no,
        id: item.mmid,
        name: item.name,
        icon: item.icon || '-',
        status: item.is_active ? 'Aktif' : 'Non-Aktif',
      }));
      setData(mappedData);
      setTotalRows(json.total);
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Gagal mengambil data', 'error');
    }
  };

  const fetchMenuDetail = async (id: number) => {
    try {
      const res = await fetch(`/master_main_menu/detail_main_menu/${id}`);
      if (!res.ok) throw new Error('Gagal mengambil data');
      const json = await res.json();

      const menu = json.data;
      return {
        mmid: menu.mmid,
        name: menu.name,
        icon: menu.icon,
        route_name: menu.route_name,
        is_active: menu.is_active,
        is_expandable: menu.is_expandable,
      };
    } catch (err) {
      Swal.fire('Error', (err as Error).message, 'error');
      return null;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (field: string, selected: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: selected?.value || '',
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData({ page: 1 });
  };

  const handleRowsChange = (selected: any) => {
    setRowsPerPage(selected.value);
    setCurrentPage(1);
    fetchData({ page: 1 });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchData({ page });
  };

  const openAddModal = () => {
    setModalMode('add');
    setEditRow(null);
    setFormValues({
      name: '',
      icon: '',
      route_name: '',
      is_active: false,
      is_expandable: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (row: Menu) => {
    const detail = await fetchMenuDetail(row.id);
    if (!detail) return;

    setModalMode('edit');
    setEditRow(detail);

    setFormValues({
      name: detail.name,
      icon: detail.icon,
      route_name: detail.route_name,
      is_active: detail.is_active,
      is_expandable: detail.is_expandable,
    });
    setIsModalOpen(true);
  };

  const handleSaveOrUpdate = async () => {
    const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

    let url = '/master_main_menu/store';
    let method: 'POST' | 'PUT' = 'POST';
    if (modalMode === 'edit' && editRow) {
      url = `/master_main_menu/update/${editRow.mmid}`;
      method = 'PUT';
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
        },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire('Tersimpan!', modalMode === 'add' ? 'Data berhasil disimpan.' : 'Data berhasil diperbarui.', 'success');
        setIsModalOpen(false);
        setEditRow(null);
        fetchData();
      } else {
        Swal.fire('Error', data.message || 'Gagal menyimpan data', 'error');
      }
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Terjadi kesalahan', 'error');
    }
  };

  const handleDelete = async (row: Menu) => {
    const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
    const result = await Swal.fire({
      title: 'Yakin?',
      text: `Apakah anda ingin menghapus menu "${row.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/master_main_menu/delete/${row.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
        },
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire('Terhapus!', data.message || 'Data berhasil dihapus.', 'success');
        fetchData();
      } else {
        Swal.fire('Error', data.message || 'Gagal menghapus data', 'error');
      }
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Terjadi kesalahan', 'error');
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Master Data" />
      <div className="bg-gray-100 min-h-screen p-6 space-y-6">

        {/* Filter Form */}
        <FilterForm
          filters={filters}
          filterFields={[{ name: 'name', placeholder: 'Nama Menu' }]}
          categoryOptions={[
            {
              field: 'category',
              options: categoryOptions,
            },
          ]}
          categoryFieldName="category"
          onInputChange={handleFilterInputChange}
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
          searchButtonLabel="Cari"
          headerAction={
            <button
              onClick={openAddModal}
              className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              <PlusIcon className="w-5 h-5" />
              Tambah
            </button>
          }
        />

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditRow(null); }}
          title={modalMode === 'add' ? 'Tambah Menu' : 'Edit Menu'}
          size="md"
        >
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label htmlFor="menuName">Nama Menu</label>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama menu"
                className="w-full rounded border px-3 py-2 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="menuIcon">Icon Menu</label>
              <input
                type="text"
                name="icon"
                value={formValues.icon}
                onChange={handleInputChange}
                placeholder="Masukkan icon menu"
                className="w-full rounded border px-3 py-2 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="menuRoute">Link</label>
              <input
                type="text"
                name="route_name"
                value={formValues.route_name}
                onChange={handleInputChange}
                placeholder="Masukkan icon menu"
                className="w-full rounded border px-3 py-2 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div></div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formValues.is_active}
                onChange={handleInputChange}
                className="rounded border-gray-300"
              />
              <label>Aktif ?</label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_expandable"
                checked={formValues.is_expandable}
                onChange={handleInputChange}
                className="rounded border-gray-300"
              />
              <label>Header ?</label>
            </div>

            <div className="lg:col-span-2">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSaveOrUpdate}
              >
                {modalMode === 'add' ? 'Simpan' : 'Update'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Table Card */}
        <div className="rounded-xl bg-white dark:bg-gray-800 shadow">
          <Pagination
            currentPage={currentPage}
            totalRows={totalRows}
            rowsPerPage={rowsPerPage}
            rowsOptions={rowsOptions}
            onPageChange={handlePageChange}
            onRowsChange={handleRowsChange}
            prevLabel="Prev"
            nextLabel="Next"
          />

          <MenuTable
            data={data}
            columns={tableColumns}
            noDataLabel="Tidak ada data"
            actions={[
              { label: 'Edit', onClick: openEditModal },
              { label: 'Hapus', onClick: handleDelete },
            ]}
          />

          <div className="flex justify-end items-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
            <span>Page {currentPage} of {Math.ceil(totalRows / rowsPerPage)}</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
