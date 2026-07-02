-- =========================================================
-- SMMS — Data Dummy untuk Testing
-- Jalankan setelah schema.sql dan rls.sql
-- Catatan: buat dulu user via Supabase Auth (Dashboard atau
-- supabase.auth.signUp), lalu update profiles.role & pasar_id
-- sesuai kebutuhan pengujian masing-masing role.
-- =========================================================

insert into public.pasar (kode_pasar, nama_pasar, alamat, luas_area, status) values
  ('PSR-001', 'Pasar Induk Sejahtera', 'Jl. Raya Induk No. 1, Kota Contoh', 15000, 'aktif'),
  ('PSR-002', 'Pasar Rakyat Melati', 'Jl. Melati No. 45, Kecamatan Contoh', 4200, 'aktif'),
  ('PSR-003', 'Pasar Daerah Anggrek', 'Jl. Anggrek Raya No. 10', 6800, 'aktif');

insert into public.blok (kode_blok, nama_blok, pasar_id) values
  ('BLK-A', 'Blok A - Sembako', (select id from public.pasar where kode_pasar = 'PSR-001')),
  ('BLK-B', 'Blok B - Sayur & Buah', (select id from public.pasar where kode_pasar = 'PSR-001')),
  ('BLK-C', 'Blok C - Daging & Ikan', (select id from public.pasar where kode_pasar = 'PSR-001')),
  ('BLK-D', 'Blok D - Pakaian', (select id from public.pasar where kode_pasar = 'PSR-002'));

insert into public.kios (kode_kios, nomor_kios, ukuran, status, blok_id) values
  ('K-A01', 'A-01', 9, 'terisi', (select id from public.blok where kode_blok = 'BLK-A')),
  ('K-A02', 'A-02', 9, 'kosong', (select id from public.blok where kode_blok = 'BLK-A')),
  ('K-B01', 'B-01', 6, 'terisi', (select id from public.blok where kode_blok = 'BLK-B')),
  ('K-C01', 'C-01', 12, 'terisi', (select id from public.blok where kode_blok = 'BLK-C')),
  ('K-D01', 'D-01', 8, 'perbaikan', (select id from public.blok where kode_blok = 'BLK-D'));

insert into public.los (kode_los, nomor_los, ukuran, status, blok_id) values
  ('L-B01', 'LB-01', 4, 'terisi', (select id from public.blok where kode_blok = 'BLK-B')),
  ('L-B02', 'LB-02', 4, 'kosong', (select id from public.blok where kode_blok = 'BLK-B'));

insert into public.pedagang (nik, nama, alamat, nomor_hp, status) values
  ('3201010101900001', 'Siti Rahayu', 'Jl. Mawar No. 12', '081234567801', 'aktif'),
  ('3201010101900002', 'Bambang Wijaya', 'Jl. Kenanga No. 5', '081234567802', 'aktif'),
  ('3201010101900003', 'Dewi Lestari', 'Jl. Kamboja No. 8', '081234567803', 'aktif'),
  ('3201010101900004', 'Agus Santoso', 'Jl. Cempaka No. 20', '081234567804', 'nonaktif');

insert into public.pegawai (nip, nama, jabatan, unit_kerja, nomor_hp, pasar_id) values
  ('198501012010011001', 'Hendra Kusuma', 'Kepala Pasar', 'Pasar Induk Sejahtera', '081298765401', (select id from public.pasar where kode_pasar = 'PSR-001')),
  ('198802022011012002', 'Rina Marlina', 'Bendahara', 'Pasar Induk Sejahtera', '081298765402', (select id from public.pasar where kode_pasar = 'PSR-001')),
  ('199003032012013003', 'Yusuf Hidayat', 'Petugas Retribusi', 'Pasar Induk Sejahtera', '081298765403', (select id from public.pasar where kode_pasar = 'PSR-001')),
  ('199104042013014004', 'Nina Kartika', 'Petugas Kebersihan', 'Pasar Rakyat Melati', '081298765404', (select id from public.pasar where kode_pasar = 'PSR-002'));

insert into public.kontrak (pedagang_id, kios_id, tanggal_mulai, tanggal_berakhir, status) values
  ((select id from public.pedagang where nik = '3201010101900001'), (select id from public.kios where kode_kios = 'K-A01'), '2025-01-01', '2026-12-31', 'aktif'),
  ((select id from public.pedagang where nik = '3201010101900002'), (select id from public.kios where kode_kios = 'K-B01'), '2025-03-01', '2026-02-28', 'aktif'),
  ((select id from public.pedagang where nik = '3201010101900003'), (select id from public.kios where kode_kios = 'K-C01'), '2024-06-01', '2025-05-31', 'berakhir');

insert into public.retribusi_harian (pedagang_id, pasar_id, tanggal, jumlah, dibayar, metode_pembayaran) values
  ((select id from public.pedagang where nik = '3201010101900001'), (select id from public.pasar where kode_pasar = 'PSR-001'), current_date, 15000, true, 'qris'),
  ((select id from public.pedagang where nik = '3201010101900002'), (select id from public.pasar where kode_pasar = 'PSR-001'), current_date, 10000, true, 'tunai'),
  ((select id from public.pedagang where nik = '3201010101900003'), (select id from public.pasar where kode_pasar = 'PSR-001'), current_date, 20000, false, null);

insert into public.kas (pasar_id, jenis, kategori, jumlah, keterangan, tanggal) values
  ((select id from public.pasar where kode_pasar = 'PSR-001'), 'masuk', 'retribusi', 45000, 'Rekap retribusi harian', current_date),
  ((select id from public.pasar where kode_pasar = 'PSR-001'), 'keluar', 'operasional', 12000, 'Pembelian alat kebersihan', current_date);

insert into public.pengaduan (pasar_id, pelapor_nama, pelapor_kontak, kategori, deskripsi, status) values
  ((select id from public.pasar where kode_pasar = 'PSR-001'), 'Warga Sekitar', '081211112222', 'kebersihan', 'Sampah menumpuk di area Blok C.', 'baru'),
  ((select id from public.pasar where kode_pasar = 'PSR-002'), 'Pengunjung', '081233334444', 'keamanan', 'Lampu area parkir mati.', 'diproses');

insert into public.aset (pasar_id, nama_aset, kategori, lokasi, kondisi, nilai_perolehan, tanggal_perolehan) values
  ((select id from public.pasar where kode_pasar = 'PSR-001'), 'Genset 50kVA', 'Utilitas', 'Ruang Genset', 'baik', 85000000, '2022-04-10'),
  ((select id from public.pasar where kode_pasar = 'PSR-001'), 'CCTV Area Parkir', 'Keamanan', 'Gerbang Utama', 'baik', 12000000, '2023-01-15'),
  ((select id from public.pasar where kode_pasar = 'PSR-002'), 'Mobil Pickup Sampah', 'Kebersihan', 'Pool Kendaraan', 'rusak', 95000000, '2019-08-20');

insert into public.promosi (pasar_id, jenis, judul, konten, aktif, tanggal_mulai, tanggal_selesai) values
  ((select id from public.pasar where kode_pasar = 'PSR-001'), 'event', 'Bazar Ramadan Pasar Induk', 'Diskon hingga 30% untuk kebutuhan pokok.', true, current_date, current_date + interval '14 days'),
  (null, 'pengumuman', 'Jam Operasional Hari Libur Nasional', 'Seluruh pasar tetap buka pukul 05.00–17.00.', true, current_date, current_date + interval '3 days');
