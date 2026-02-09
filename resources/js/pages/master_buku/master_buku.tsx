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
import Select from 'react-select';

import { pdf } from '@react-pdf/renderer';
import BukuPdf from '@/pages/master_buku/master_buku_pdf';
import { buildBukuXls } from '@/pages/master_buku/master_buku_xls';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Buku {
  no: number;
  id: number;
  judul: string;
  penulis: string;
  kategori: string;
  tanggal_rilis: string;
  jumlah_halaman: number;
  is_active: string;
}

interface BukuDetail {
  jbid: number;
  judul: string;
  penulis: string;
  jenis_buku: number;
  tanggal_rilis: string;
  jumlah_halaman: number;
  is_active: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Master Data', href: dashboard().url },
];

const statusOptions = [
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
  { key: 'judul', label: 'Judul Buku' },
  { key: 'penulis', label: 'Penulis' },
  { key: 'kategori', label: 'Jenis' },
  { key: 'tanggal_rilis', label: 'Tgl. Rilis' },
  { key: 'jumlah_halaman', label: 'Halaman' },
  { key: 'is_active', label: 'Status' },
];

export default function MainMenuList() {
    const [filters, setFilters] = useState({
        sjudul: '',
        spenulis: '',
        sstatus: '',
        sjenis: '',
    });
  const [data, setData] = useState<Buku[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editRow, setEditRow] = useState<BukuDetail | null>(null);

  const [isPreparingPdf, setIsPreparingPdf] = useState(false);
  const [isPreparingXls, setIsPreparingXls] = useState(false);

  const [formValues, setFormValues] = useState({
    judul: '',
    penulis: '',
    rilis: '',
    jumlah: '',
    jenis_buku: null as number | null,
    is_active: false,
  });
  
  const [jenisBukuOptions, setJenisBukuOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const fetchData = async (overrideParams: any = {}) => {
    try {
      const queryParams = {
        ...filters,
        page: currentPage,
        per_page: rowsPerPage,
        ...overrideParams,
      };
      const query = new URLSearchParams(queryParams).toString();
      
      const res = await fetch(`/list_buku?${query}`);
      if (!res.ok) throw new Error('Gagal mengambil data');
      const json = await res.json();
      const mappedData = json.data.map((item: any) => ({
        no: item.no,
        id: item.jbid,
        judul: item.judul,
        penulis: item.penulis || '-',
        kategori: item.kategori || '-',
        tanggal_rilis: item.tanggal_rilis,
        jumlah_halaman: item.jumlah_halaman,
        is_active: item.is_active ? 'Aktif' : 'Non-Aktif',
      }));
      setData(mappedData);
      setTotalRows(json.total);
    } catch (err: any) {
      Swal.fire('Error', err.message || 'Gagal mengambil data', 'error');
    }
  };

  const fetchMenuDetail = async (id: number) => {
    try {
      const res = await fetch(`/master_buku/detail_buku/${id}`);
      if (!res.ok) throw new Error('Gagal mengambil data');
      const json = await res.json();

      const buku = json.data;

      return {
        jbid: buku.jbid,
        judul: buku.judul,
        penulis: buku.penulis,
        jenis_buku: buku.jenis_buku,
        tanggal_rilis: buku.tanggal_rilis,
        jumlah_halaman: buku.jumlah_halaman,
        is_active: buku.is_active,
      };
    } catch (err) {
      Swal.fire('Error', (err as Error).message, 'error');
      return null;
    }
  };

  const fetchJenisBuku = async () => {
  try {
    const res = await fetch('/jenis_buku');
    if (!res.ok) throw new Error('Gagal mengambil jenis buku');

    const json = await res.json();

    const options = [
      { value: '', label: 'Semua' },
      ...json.data.map((item: any) => ({
        value: String(item.kbid),
        label: item.kategori,
      })),
    ];

    setJenisBukuOptions(options);
  } catch (err: any) {
    Swal.fire('Error', err.message || 'Gagal mengambil jenis buku', 'error');
  }
};

  const fetchDataForPdf = async () => {
    try {
      const queryParams = {
        ...filters,
        per_page: 1000000,
      };

      const query = new URLSearchParams(queryParams).toString();
      const res = await fetch(`/list_buku?${query}`);
      if (!res.ok) throw new Error('Gagal mengambil data PDF');

      const json = await res.json();

      return json.data.map((item: any, index: number) => ({
        no: index + 1,
        id: item.jbid,
        judul: item.judul,
        penulis: item.penulis || '-',
        kategori: item.kategori || '-',
        tanggal_rilis: item.tanggal_rilis || '-',
        jumlah_halaman: item.jumlah_halaman || '-',
        is_active: item.is_active ? 'Aktif' : 'Non-Aktif',
      }));
    } catch (err) {
      Swal.fire('Error', 'Gagal menyiapkan data PDF', 'error');
      return [];
    }
  };

  useEffect(() => {
    fetchData();
    fetchJenisBuku();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFilters(prev => ({
          ...prev,
          [name]: value,
      }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormValues(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
      }));
  };

  const handleCategoryChange = (field: string, selected: any) => {
      setFilters(prev => ({
          ...prev,
          [field]: selected ? selected.value : null,
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
      judul: '',
      penulis: '',
      rilis: '',
      jumlah: '',
      is_active: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (row: Buku) => {
    const detail = await fetchMenuDetail(row.id);
    if (!detail) return;
    
    setModalMode('edit');
    setEditRow(detail);

    setFormValues({
        judul: detail.judul,
        penulis: detail.penulis,
        rilis: detail.tanggal_rilis ? detail.tanggal_rilis.slice(0, 10) : '',
        jumlah: detail.jumlah_halaman,
        jenis_buku: detail.jenis_buku,
        is_active: detail.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSaveOrUpdate = async () => {
    const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
    
    let url = '/master_buku/store';
    let method: 'POST' | 'PUT' = 'POST';
    if (modalMode === 'edit' && editRow) {
      url = `/master_buku/update/${editRow.jbid}`;
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
            filterFields={[
                { name: 'sjudul', placeholder: 'Judul Buku' },
                { name: 'spenulis', placeholder: 'Penulis' },
            ]}
            categoryOptions={[
                { field: 'sstatus', options: statusOptions },
                { field: 'sjenis', options: jenisBukuOptions },
            ]}
            onInputChange={handleFilterChange}
            onCategoryChange={handleCategoryChange}
            onSearch={handleSearch}
            searchButtonLabel="Cari"
            headerAction={
              <div className="flex gap-2">
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  <PlusIcon className="w-5 h-5" />
                  Tambah
                </button>

                <button
                  onClick={async () => {
                    if (isPreparingPdf) return;

                    try {
                      setIsPreparingPdf(true);

                      const allData = await fetchDataForPdf();

                      if (!allData.length) {
                        Swal.fire('Info', 'Data kosong', 'info');
                        return;
                      }

                      const selectedJenis = jenisBukuOptions.find(
                        opt => opt.value === filters.sjenis
                      );

                      const blob = await pdf(
                        <BukuPdf
                          data={allData}
                          filters={{
                            ...filters,
                            sjenis_label: selectedJenis?.label || 'Semua',
                          }}
                        />
                      ).toBlob();

                      const url = URL.createObjectURL(blob);

                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `data_buku_${Date.now()}.pdf`;
                      document.body.appendChild(a);
                      a.click();

                      a.remove();
                      URL.revokeObjectURL(url);
                    } catch (err) {
                      Swal.fire('Error', 'Gagal export PDF', 'error');
                    } finally {
                      setIsPreparingPdf(false);
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  {isPreparingPdf ? 'Menyiapkan PDF...' : 'Export PDF'}
                </button>

                <button
                  onClick={async () => {
                    if (isPreparingXls) return;

                    try {
                      setIsPreparingXls(true);

                      const allData = await fetchDataForPdf();

                      if (!allData.length) {
                        Swal.fire('Info', 'Data kosong', 'info');
                        return;
                      }

                      const selectedJenis = jenisBukuOptions.find(
                        opt => opt.value === filters.sjenis
                      );

                      const workbook = buildBukuXls({
                        data: allData,
                        filters: {
                          ...filters,
                          sjenis_label: selectedJenis?.label || '-',
                        },
                      });

                      const excelBuffer = XLSX.write(workbook, {
                        bookType: 'xlsx',
                        type: 'array',
                      });

                      const blob = new Blob([excelBuffer], {
                        type:
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      });

                      saveAs(blob, `data_buku_${Date.now()}.xlsx`);
                    } catch (err) {
                      Swal.fire('Error', 'Gagal export XLS', 'error');
                    } finally {
                      setIsPreparingXls(false);
                    }
                  }}
                  className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
                >
                  {isPreparingXls ? 'Menyiapkan XLS...' : 'Export XLS'}
                </button>
                
              </div>
            }
        />

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditRow(null); }}
          title={modalMode === 'add' ? 'Tambah Buku' : 'Edit Buku'}
          size="lg"
        >
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
                <label className="block mb-1">Jenis Buku</label>
                <Select
                    options={jenisBukuOptions}
                    value={jenisBukuOptions.find(
                    opt => opt.value === formValues.jenis_buku
                    )}
                    onChange={(selected) =>
                    setFormValues(prev => ({
                        ...prev,
                        jenis_buku: selected ? selected.value : null,
                    }))
                    }
                    placeholder="Pilih Jenis Buku"
                    isClearable
                    classNamePrefix="select"
                />
            </div>

            <div>
              <label htmlFor="judulBuku">Judul</label>
              <input
                type="text"
                name="judul"
                value={formValues.judul}
                onChange={handleInputChange}
                placeholder="Masukan Judul"
                className="w-full rounded border px-3 py-2 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="penulisBuku">Penulis</label>
              <input
                type="text"
                name="penulis"
                value={formValues.penulis}
                onChange={handleInputChange}
                placeholder="Masukkan Penulis Buku"
                className="w-full rounded border px-3 py-2 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="rilisBuku">Tgl. Rilis</label>
              <input
                type="date"
                name="rilis"
                value={formValues.rilis}
                onChange={handleInputChange}
                placeholder="Masukkan Tgl. Rilis"
                className="w-full rounded border px-3 py-2 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
                <label htmlFor="halamanBuku">Jumlah Halaman</label>
                <input
                    type="text"
                    name="jumlah"
                    value={formValues.jumlah}
                    inputMode="numeric"
                    placeholder="Masukkan Jumlah Halaman"
                    onKeyDown={(e) => {
                    const allowedKeys = [
                        'Backspace',
                        'Delete',
                        'ArrowLeft',
                        'ArrowRight',
                        'Tab',
                    ];

                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                        e.preventDefault();
                        return;
                    }

                    if (/[0-9]/.test(e.key)) {
                        const nextValue = `${formValues.jumlah}${e.key}`;
                        if (Number(nextValue) > 2000) {
                        e.preventDefault();
                        }
                    }
                    }}
                    onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');

                    if (Number(value) > 2000) {
                        value = '2000';
                    }

                    setFormValues(prev => ({
                        ...prev,
                        jumlah: value,
                    }));
                    }}
                    className="w-full rounded border px-3 py-2 focus:ring-1 focus:ring-blue-500"
                />
                <small className="text-gray-500">Maksimal 2000 halaman</small>
                </div>

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
