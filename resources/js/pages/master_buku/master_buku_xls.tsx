import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Buku {
  judul: string;
  penulis: string;
  kategori: string;
  tanggal_rilis: string;
  jumlah_halaman: number;
  is_active: string; // "1" atau "0"
}

export function buildBukuXls({
  data,
  filters,
}: {
  data: Buku[];
  filters: Record<string, string>;
}) {
  const printedAt = new Date().toLocaleString();

  // Mapping key -> label untuk Excel
  const filterMap: Record<string, string> = {
    sjudul: 'Judul',
    spenulis: 'Penulis',
    sjenis_label: 'Jenis Buku',
    sstatus: 'Status',
  };

  // Fungsi helper untuk status
  const getStatusLabel = (val?: string) => {
    if (val === 'true' || val === '1') return 'Aktif';
    if (val === 'false' || val === '0') return 'Non-Aktif';
    return '-';
  };

  // Buat teks filter: semua filter selalu muncul
  const filterText = Object.entries(filterMap)
    .map(([key, label]) => {
      if (key === 'sstatus') return `${label} : ${getStatusLabel(filters[key])}`;
      return `${label} : ${filters[key] || '-'}`;
    })
    .join(' | ');

  // Header Excel
  const headerRows = [
    ['DATA BUKU'],
    [`Dicetak : ${printedAt}`],
    [`Filter : ${filterText}`],
    [],
  ];

  // Tabel header
  const tableHeader = [
    'No',
    'Judul',
    'Penulis',
    'Jenis',
    'Tanggal Rilis',
    'Jumlah Halaman',
    'Status',
  ];

  // Tabel data
  const tableData = data.map((row, i) => [
    i + 1,
    row.judul,
    row.penulis,
    row.kategori,
    row.tanggal_rilis,
    row.jumlah_halaman,
    row.is_active === '1' ? 'Aktif' : 'Non-Aktif',
  ]);

  const sheetData = [...headerRows, tableHeader, ...tableData];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // Atur lebar kolom
  worksheet['!cols'] = [
    { wch: 5 },   // No
    { wch: 30 },  // Judul
    { wch: 20 },  // Penulis
    { wch: 20 },  // Jenis
    { wch: 15 },  // Tanggal Rilis
    { wch: 18 },  // Jumlah Halaman
    { wch: 12 },  // Status
  ];

  // Merge judul utama
  worksheet['!merges'] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: 6 },
    },
  ];

  // Freeze header
  worksheet['!freeze'] = {
    xSplit: 0,
    ySplit: headerRows.length + 1, // freeze sampai sebelum tabel data
  };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Buku');

  return workbook;
}
