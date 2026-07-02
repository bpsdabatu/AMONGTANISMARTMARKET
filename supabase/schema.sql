-- =========================================================
-- SMMS — Smart Market Management System
-- Skema Database Inti (Modul 1: Master Data)
-- Jalankan di Supabase SQL Editor, atau via:
--   supabase db push
-- =========================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------
create type user_role as enum (
  'super_admin',
  'direksi',
  'kepala_pasar',
  'bendahara',
  'petugas_retribusi',
  'petugas_kebersihan',
  'petugas_keamanan',
  'petugas_parkir',
  'pedagang',
  'pengunjung'
);

create type status_umum as enum ('aktif', 'nonaktif');
create type status_unit as enum ('kosong', 'terisi', 'perbaikan');
create type status_pengaduan as enum ('baru', 'diproses', 'selesai', 'ditutup');
create type status_kontrak as enum ('aktif', 'berakhir', 'diputus');

-- ---------------------------------------------------------
-- PROFIL PENGGUNA (terhubung ke auth.users Supabase Auth)
-- ---------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null,
  role user_role not null default 'pengunjung',
  pasar_id uuid,              -- dibatasi ke satu pasar untuk Kepala Pasar/Bendahara/Petugas
  pedagang_id uuid,           -- diisi jika role = pedagang
  nomor_hp text,
  foto_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- MODUL 1: MASTER DATA
-- ---------------------------------------------------------

create table public.pasar (
  id uuid primary key default gen_random_uuid(),
  kode_pasar text not null unique,
  nama_pasar text not null,
  alamat text,
  luas_area numeric(12,2),        -- meter persegi
  status status_umum not null default 'aktif',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blok (
  id uuid primary key default gen_random_uuid(),
  kode_blok text not null unique,
  nama_blok text not null,
  pasar_id uuid not null references public.pasar(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kios (
  id uuid primary key default gen_random_uuid(),
  kode_kios text not null unique,
  nomor_kios text not null,
  ukuran numeric(8,2),            -- meter persegi
  status status_unit not null default 'kosong',
  blok_id uuid not null references public.blok(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.los (
  id uuid primary key default gen_random_uuid(),
  kode_los text not null unique,
  nomor_los text not null,
  ukuran numeric(8,2),
  status status_unit not null default 'kosong',
  blok_id uuid not null references public.blok(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pedagang (
  id uuid primary key default gen_random_uuid(),
  nik text not null unique,
  nama text not null,
  alamat text,
  nomor_hp text,
  foto text,
  status status_umum not null default 'aktif',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pegawai (
  id uuid primary key default gen_random_uuid(),
  nip text not null unique,
  nama text not null,
  jabatan text,
  unit_kerja text,
  nomor_hp text,
  pasar_id uuid references public.pasar(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_pasar_id_fkey foreign key (pasar_id) references public.pasar(id) on delete set null,
  add constraint profiles_pedagang_id_fkey foreign key (pedagang_id) references public.pedagang(id) on delete set null;

-- ---------------------------------------------------------
-- MODUL 2: MANAJEMEN PEDAGANG (kontrak & penempatan)
-- ---------------------------------------------------------
create table public.kontrak (
  id uuid primary key default gen_random_uuid(),
  pedagang_id uuid not null references public.pedagang(id) on delete cascade,
  kios_id uuid references public.kios(id) on delete set null,
  los_id uuid references public.los(id) on delete set null,
  tanggal_mulai date not null,
  tanggal_berakhir date not null,
  status status_kontrak not null default 'aktif',
  keterangan text,
  created_at timestamptz not null default now(),
  check (kios_id is not null or los_id is not null)
);

create table public.mutasi_kios (
  id uuid primary key default gen_random_uuid(),
  pedagang_id uuid not null references public.pedagang(id) on delete cascade,
  kios_lama_id uuid references public.kios(id),
  kios_baru_id uuid references public.kios(id),
  tanggal_mutasi date not null default current_date,
  alasan text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- MODUL 3: KEUANGAN
-- ---------------------------------------------------------
create table public.retribusi_harian (
  id uuid primary key default gen_random_uuid(),
  pedagang_id uuid not null references public.pedagang(id),
  pasar_id uuid not null references public.pasar(id),
  petugas_id uuid references public.pegawai(id),
  tanggal date not null default current_date,
  jumlah numeric(12,2) not null,
  dibayar boolean not null default false,
  metode_pembayaran text,       -- tunai / qris
  created_at timestamptz not null default now()
);

create table public.tagihan_sewa (
  id uuid primary key default gen_random_uuid(),
  kontrak_id uuid not null references public.kontrak(id) on delete cascade,
  periode text not null,        -- contoh: '2026-07'
  jumlah numeric(12,2) not null,
  denda numeric(12,2) not null default 0,
  status_bayar text not null default 'belum_bayar',
  jatuh_tempo date not null,
  dibayar_pada timestamptz,
  created_at timestamptz not null default now()
);

create table public.kas (
  id uuid primary key default gen_random_uuid(),
  pasar_id uuid not null references public.pasar(id),
  jenis text not null check (jenis in ('masuk', 'keluar')),
  kategori text not null,
  jumlah numeric(12,2) not null,
  keterangan text,
  tanggal date not null default current_date,
  dicatat_oleh uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- MODUL 4: PENGADUAN
-- ---------------------------------------------------------
create table public.pengaduan (
  id uuid primary key default gen_random_uuid(),
  pasar_id uuid references public.pasar(id),
  pelapor_nama text not null,
  pelapor_kontak text,
  kategori text,
  deskripsi text not null,
  foto_url text,
  status status_pengaduan not null default 'baru',
  ditugaskan_ke uuid references public.pegawai(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- MODUL 5: KEBERSIHAN
-- ---------------------------------------------------------
create table public.tugas_kebersihan (
  id uuid primary key default gen_random_uuid(),
  pasar_id uuid not null references public.pasar(id),
  petugas_id uuid not null references public.pegawai(id),
  area_kerja text not null,
  tanggal date not null default current_date,
  selesai boolean not null default false,
  foto_dokumentasi text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- MODUL 6: KEAMANAN
-- ---------------------------------------------------------
create table public.buku_kejadian (
  id uuid primary key default gen_random_uuid(),
  pasar_id uuid not null references public.pasar(id),
  petugas_id uuid references public.pegawai(id),
  jenis_kejadian text not null,
  deskripsi text,
  foto_url text,
  waktu_kejadian timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.patroli (
  id uuid primary key default gen_random_uuid(),
  pasar_id uuid not null references public.pasar(id),
  petugas_id uuid references public.pegawai(id),
  shift text not null,
  waktu date not null default current_date,
  selesai boolean not null default false,
  catatan text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- MODUL 7: PARKIR
-- ---------------------------------------------------------
create table public.setoran_parkir (
  id uuid primary key default gen_random_uuid(),
  pasar_id uuid not null references public.pasar(id),
  petugas_id uuid references public.pegawai(id),
  shift text not null,
  tanggal date not null default current_date,
  jumlah_kendaraan int not null default 0,
  jumlah_setoran numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- MODUL 8: ASET
-- ---------------------------------------------------------
create table public.aset (
  id uuid primary key default gen_random_uuid(),
  pasar_id uuid not null references public.pasar(id),
  nama_aset text not null,
  kategori text,
  lokasi text,
  kondisi text not null default 'baik',
  nilai_perolehan numeric(14,2),
  tanggal_perolehan date,
  penyusutan_per_tahun numeric(14,2) default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- MODUL 9: PROMOSI PASAR
-- ---------------------------------------------------------
create table public.promosi (
  id uuid primary key default gen_random_uuid(),
  pasar_id uuid references public.pasar(id),
  jenis text not null check (jenis in ('banner', 'event', 'berita', 'pengumuman')),
  judul text not null,
  konten text,
  gambar_url text,
  tanggal_mulai date,
  tanggal_selesai date,
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------
create index idx_blok_pasar on public.blok(pasar_id);
create index idx_kios_blok on public.kios(blok_id);
create index idx_los_blok on public.los(blok_id);
create index idx_kontrak_pedagang on public.kontrak(pedagang_id);
create index idx_retribusi_tanggal on public.retribusi_harian(tanggal);
create index idx_retribusi_pasar on public.retribusi_harian(pasar_id);
create index idx_tagihan_periode on public.tagihan_sewa(periode);
create index idx_kas_pasar_tanggal on public.kas(pasar_id, tanggal);
create index idx_pengaduan_status on public.pengaduan(status);
create index idx_profiles_role on public.profiles(role);

-- ---------------------------------------------------------
-- updated_at auto-touch trigger
-- ---------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_pasar_updated before update on public.pasar
  for each row execute function public.touch_updated_at();
create trigger trg_blok_updated before update on public.blok
  for each row execute function public.touch_updated_at();
create trigger trg_kios_updated before update on public.kios
  for each row execute function public.touch_updated_at();
create trigger trg_los_updated before update on public.los
  for each row execute function public.touch_updated_at();
create trigger trg_pedagang_updated before update on public.pedagang
  for each row execute function public.touch_updated_at();
create trigger trg_pegawai_updated before update on public.pegawai
  for each row execute function public.touch_updated_at();
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger trg_pengaduan_updated before update on public.pengaduan
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------
-- Auto-create profile saat user baru mendaftar via Supabase Auth
-- ---------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nama, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nama', new.email),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'pengunjung')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
