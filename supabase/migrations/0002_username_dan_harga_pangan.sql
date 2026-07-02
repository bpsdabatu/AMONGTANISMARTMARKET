-- =========================================================
-- AmongTaniSmartMarket — Migrasi 0002
-- 1) Login berbasis username (bukan email)
-- 2) Modul Harga Bahan Pokok (dashboard publik)
--
-- Jalankan di Supabase SQL Editor pada project yang SUDAH
-- menjalankan schema.sql + rls.sql sebelumnya.
-- =========================================================

-- ---------------------------------------------------------
-- 1. USERNAME LOGIN
-- ---------------------------------------------------------
-- Supabase Auth secara native berbasis email. Untuk login
-- berbasis username, kita simpan username di profiles, lalu
-- sediakan fungsi publik yang menerjemahkan username -> email
-- (tanpa membocorkan data lain), yang dipanggil dari form login
-- sebelum memanggil signInWithPassword().

alter table public.profiles
  add column if not exists username text unique;

-- Format username: huruf kecil, angka, titik, garis bawah, 3-32 karakter
alter table public.profiles
  add constraint profiles_username_format
  check (username is null or username ~ '^[a-z0-9._]{3,32}$');

create index if not exists idx_profiles_username on public.profiles(username);

-- Perbarui trigger auto-create profile agar ikut mengisi username
-- dari metadata saat Super Admin membuat akun baru.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nama, role, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nama', new.email),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'pengunjung'),
    lower(new.raw_user_meta_data->>'username')
  );
  return new;
end;
$$ language plpgsql security definer;
-- (trigger on_auth_user_created sudah ada dari schema.sql, tidak perlu dibuat ulang)

create or replace function public.email_for_username(p_username text)
returns text as $$
  select au.email
  from public.profiles p
  join auth.users au on au.id = p.id
  where p.username = lower(p_username)
  limit 1;
$$ language sql stable security definer set search_path = public;

-- Hanya boleh dipanggil untuk resolve login, bukan untuk enumerasi data lain
revoke all on function public.email_for_username(text) from public;
grant execute on function public.email_for_username(text) to anon, authenticated;

-- ---------------------------------------------------------
-- 2. MODUL HARGA BAHAN POKOK (dashboard publik)
-- ---------------------------------------------------------
-- Catatan sumber data: Siskaperbapo (siskaperbapo.jatimprov.go.id)
-- tidak menyediakan API publik dan memblokir akses otomatis
-- (bot detection), sehingga data di sini diinput manual oleh
-- Petugas Retribusi/Kepala Pasar setiap hari. Kolom `sumber`
-- disiapkan agar bisa beralih ke feed resmi Disperindag Jatim
-- di kemudian hari tanpa mengubah struktur tabel.

create table if not exists public.komoditas (
  id uuid primary key default gen_random_uuid(),
  nama text not null unique,
  kategori text not null,        -- contoh: 'Sembako', 'Sayur & Bumbu', 'Protein'
  satuan text not null,           -- contoh: 'kg', 'liter', 'butir'
  urutan int not null default 0,
  aktif boolean not null default true
);

create table if not exists public.harga_komoditas (
  id uuid primary key default gen_random_uuid(),
  komoditas_id uuid not null references public.komoditas(id) on delete cascade,
  pasar_id uuid references public.pasar(id) on delete cascade,
  harga numeric(12,2) not null check (harga >= 0),
  tanggal date not null default current_date,
  sumber text not null default 'manual' check (sumber in ('manual', 'siskaperbapo')),
  dicatat_oleh uuid references public.profiles(id),
  catatan text,
  created_at timestamptz not null default now(),
  unique (komoditas_id, pasar_id, tanggal)
);

create index if not exists idx_harga_tanggal on public.harga_komoditas(tanggal desc);
create index if not exists idx_harga_komoditas_id on public.harga_komoditas(komoditas_id);

-- View harga terbaru per komoditas (rata-rata seluruh pasar, hari terakhir yang ada datanya)
create or replace view public.harga_terkini as
select distinct on (k.id)
  k.id as komoditas_id,
  k.nama,
  k.kategori,
  k.satuan,
  k.urutan,
  round(avg(h.harga) over (partition by k.id, h.tanggal))::numeric as harga_rata_rata,
  h.tanggal,
  h.sumber
from public.komoditas k
join public.harga_komoditas h on h.komoditas_id = k.id
where k.aktif = true
order by k.id, h.tanggal desc;

alter table public.komoditas enable row level security;
alter table public.harga_komoditas enable row level security;

create policy "komoditas: publik dapat membaca" on public.komoditas
  for select using (true);

create policy "komoditas: staf pasar & admin kelola" on public.komoditas
  for all using (
    public.current_role_name() in ('super_admin', 'direksi', 'kepala_pasar', 'petugas_retribusi')
  );

create policy "harga: publik dapat membaca" on public.harga_komoditas
  for select using (true);

create policy "harga: staf pasar terkait input & kelola" on public.harga_komoditas
  for insert with check (
    pasar_id is null
      and public.current_role_name() in ('super_admin', 'direksi')
    or public.is_staff_pasar(pasar_id)
  );

create policy "harga: staf pasar terkait ubah/hapus" on public.harga_komoditas
  for update using (
    pasar_id is null
      and public.current_role_name() in ('super_admin', 'direksi')
    or public.is_staff_pasar(pasar_id)
  );

create policy "harga: staf pasar terkait hapus" on public.harga_komoditas
  for delete using (
    pasar_id is null
      and public.current_role_name() in ('super_admin', 'direksi')
    or public.is_staff_pasar(pasar_id)
  );

-- ---------------------------------------------------------
-- Data awal daftar komoditas (bahan pokok umum ala Siskaperbapo)
-- ---------------------------------------------------------
insert into public.komoditas (nama, kategori, satuan, urutan) values
  ('Beras Medium', 'Sembako', 'kg', 1),
  ('Beras Premium', 'Sembako', 'kg', 2),
  ('Gula Pasir', 'Sembako', 'kg', 3),
  ('Minyak Goreng Curah', 'Sembako', 'liter', 4),
  ('Minyak Goreng Kemasan', 'Sembako', 'liter', 5),
  ('Telur Ayam Ras', 'Protein', 'kg', 6),
  ('Daging Ayam Ras', 'Protein', 'kg', 7),
  ('Daging Sapi', 'Protein', 'kg', 8),
  ('Bawang Merah', 'Sayur & Bumbu', 'kg', 9),
  ('Bawang Putih', 'Sayur & Bumbu', 'kg', 10),
  ('Cabai Merah Keriting', 'Sayur & Bumbu', 'kg', 11),
  ('Cabai Rawit', 'Sayur & Bumbu', 'kg', 12),
  ('Tepung Terigu', 'Sembako', 'kg', 13),
  ('Kedelai', 'Sembako', 'kg', 14),
  ('Garam Konsumsi', 'Sembako', 'kg', 15)
on conflict (nama) do nothing;
