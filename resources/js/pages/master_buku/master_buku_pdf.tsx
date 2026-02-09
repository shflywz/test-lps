import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

interface Buku {
  judul: string;
  penulis: string;
  kategori: string;
  sjenis_label: string;
  jumlah_halaman: BigInteger;
  tanggal_rilis: string;
  is_active: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },

  /* ===== Header ===== */
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    marginTop: 10,
  },

  /* ===== Filter Info ===== */
  filterBox: {
    marginVertical: 10,
    padding: 8,
    backgroundColor: '#f4f4f4',
    borderRadius: 4,
  },
  filterText: {
    fontSize: 9,
    color: '#333',
  },

  /* ===== Table ===== */
  table: {
    width: '100%',
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#eaeaea',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  bodyRow: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  zebra: {
    backgroundColor: '#fafafa',
  },

  cell: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  no: { width: '5%', textAlign: 'center' },
  judul: { width: '35%' },
  penulis: { width: '25%' },
  kategori: { width: '20%' },
  status: { width: '15%', textAlign: 'center' },

  headerText: {
    fontWeight: 'bold',
  },

  statusActive: {
    fontWeight: 'bold',
  },
  statusInactive: {
    color: '#777',
  },

  /* ===== Footer ===== */
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 32,
    right: 32,
    fontSize: 8,
    textAlign: 'center',
    color: '#777',
  },
});

export default function MasterBukuPdf({
  data,
  filters,
}: {
  data: Buku[];
  filters: Record<string, string>;
}) {
  const activeFilters = Object.entries(filters).filter(([, v]) => v);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Data Buku</Text>
          <Text style={styles.subtitle}>
            Dicetak pada {new Date().toLocaleString()}
          </Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.filterBox}>
          <Text style={styles.filterText}>
              Judul : {filters.sjudul || '-'}
          </Text>
          <Text style={styles.filterText}>
              Penulis : {filters.spenulis || '-'}
          </Text>
          <Text style={styles.filterText}>
              Jenis : {filters.sjenis_label || '-'}
          </Text>
          <Text style={styles.filterText}>
              Status : {(filters.sstatus ?? '-') == 'true' ? 'Aktif' : ((filters.sstatus ?? '') == '' ? 'Semua' : 'Non-Aktif')}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.no, styles.headerText]}>No</Text>
            <Text style={[styles.cell, styles.judul, styles.headerText]}>Judul</Text>
            <Text style={[styles.cell, styles.penulis, styles.headerText]}>Penulis</Text>
            <Text style={[styles.cell, styles.kategori, styles.headerText]}>Jenis</Text>
            <Text style={[styles.cell, styles.kategori, styles.headerText]}>Halaman</Text>
            <Text style={[styles.cell, styles.status, styles.headerText]}>Tgl. Rilis</Text>
            <Text style={[styles.cell, styles.status, styles.headerText]}>Status</Text>
          </View>

          {/* Body */}
          {data.map((row, i) => (
            <View
              key={i}
              style={[
                styles.row,
                styles.bodyRow,
                i % 2 === 1 && styles.zebra,
              ]}
            >
              <Text style={[styles.cell, styles.no]}>{i + 1}</Text>
              <Text style={[styles.cell, styles.judul]}>{row.judul}</Text>
              <Text style={[styles.cell, styles.penulis]}>{row.penulis}</Text>
              <Text style={[styles.cell, styles.kategori]}>{row.kategori}</Text>
              <Text style={[styles.cell, styles.kategori]}>{row.jumlah_halaman}</Text>
              <Text style={[styles.cell, styles.kategori]}>{row.tanggal_rilis}</Text>
              <Text
                style={[
                  styles.cell,
                  styles.status,
                  row.is_active === '1'
                    ? styles.statusActive
                    : styles.statusInactive,
                ]}>
                {row.is_active === '1' ? 'AKTIF' : 'NONAKTIF'}
              </Text>
            </View>
          ))}
        </View>

        {/* <Text style={styles.footer}>
          © Sistem Perpustakaan — Halaman ini dicetak otomatis
        </Text> */}
      </Page>
    </Document>
  );
}
