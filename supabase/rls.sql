-- =========================================================
-- AmongTaniSmartMarket — Row Level Security (RLS) Policies
-- Jalankan setelah schema.sql
-- =========================================================

-- ---------------------------------------------------------
-- Helper functions (SECURITY DEFINER agar tidak infinite-recurse
-- saat dipakai di dalam policy tabel profiles sendiri)
-- ---------------------------------------------------------
create or replace function public.current_role_name()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable security definer;

create or replace function public.current_pasar_id()
returns uuid as $$
  select pasar_id from public.profiles where id = auth.uid();
$$ language sql stable security definer;

create or replace function public.current_pedagang_id()
returns uuid as $$
  select pedagang_id from public.profiles where id = auth.uid();
$$ language sql stable security definer;

create or replace function public.is_staff_pasar(target_pasar_id uuid)
returns boolean as $$
  select public.current_role_name() in ('super_admin', 'direksi')
    or (public.current_role_name() in (
          'kepala_pasar','bendahara','petugas_retribusi',
          'petugas_kebersihan','petugas_keamanan','petugas_parkir'
        )
        and public.current_pasar_id() = target_pasar_id);
$$ language sql stable security definer;

-- ---------------------------------------------------------
-- Enable RLS di semua tabel
-- ---------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.pasar enable row level security;
alter table public.blok enable row level security;
alter table public.kios enable row level security;
alter table public.los enable row level security;
alter table public.pedagang enable row level security;
alter table public.pegawai enable row level security;
alter table public.kontrak enable row level security;
alter table public.mutasi_kios enable row level security;
alter table public.retribusi_harian enable row level security;
alter table public.tagihan_sewa enable row level security;
alter table public.kas enable row level security;
alter table public.pengaduan enable row level security;
alter table public.tugas_kebersihan enable row level security;
alter table public.buku_kejadian enable row level security;
alter table public.patroli enable row level security;
alter table public.setoran_parkir enable row level security;
alter table public.aset enable row level security;
alter table public.promosi enable row level security;

-- ---------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------
create policy "profil: lihat milik sendiri" on public.profiles
  for select using (id = auth.uid());

create policy "profil: super admin lihat semua" on public.profiles
  for select using (public.current_role_name() = 'super_admin');

create policy "profil: update milik sendiri" on public.profiles
  for update using (id = auth.uid());

create policy "profil: super admin kelola semua" on public.profiles
  for all using (public.current_role_name() = 'super_admin');

-- ---------------------------------------------------------
-- PASAR — publik boleh baca (untuk halaman promosi/pengunjung),
-- hanya Super Admin & Direksi yang boleh ubah
-- ---------------------------------------------------------
create policy "pasar: publik dapat membaca" on public.pasar
  for select using (true);

create policy "pasar: admin & direksi kelola" on public.pasar
  for all using (public.current_role_name() in ('super_admin', 'direksi'));

-- ---------------------------------------------------------
-- BLOK / KIOS / LOS — publik boleh baca (info ketersediaan kios),
-- staf pasar terkait & admin boleh kelola
-- ---------------------------------------------------------
create policy "blok: publik dapat membaca" on public.blok
  for select using (true);
create policy "blok: staf pasar kelola" on public.blok
  for all using (public.is_staff_pasar(pasar_id));

create policy "kios: publik dapat membaca" on public.kios
  for select using (true);
create policy "kios: staf pasar kelola" on public.kios
  for all using (
    public.is_staff_pasar((select pasar_id from public.blok where id = kios.blok_id))
  );

create policy "los: publik dapat membaca" on public.los
  for select using (true);
create policy "los: staf pasar kelola" on public.los
  for all using (
    public.is_staff_pasar((select pasar_id from public.blok where id = los.blok_id))
  );

-- ---------------------------------------------------------
-- PEDAGANG — pedagang hanya lihat data sendiri, staf pasar & admin lihat semua
-- ---------------------------------------------------------
create policy "pedagang: lihat data sendiri" on public.pedagang
  for select using (id = public.current_pedagang_id());

create policy "pedagang: admin & direksi lihat semua" on public.pedagang
  for select using (public.current_role_name() in ('super_admin', 'direksi'));

create policy "pedagang: staf operasional lihat & kelola" on public.pedagang
  for all using (
    public.current_role_name() in (
      'kepala_pasar', 'bendahara', 'petugas_retribusi'
    )
  );

-- ---------------------------------------------------------
-- PEGAWAI — hanya admin, direksi, dan kepala pasar terkait
-- ---------------------------------------------------------
create policy "pegawai: admin & direksi kelola semua" on public.pegawai
  for all using (public.current_role_name() in ('super_admin', 'direksi'));

create policy "pegawai: kepala pasar lihat unitnya" on public.pegawai
  for select using (
    public.current_role_name() = 'kepala_pasar'
    and pasar_id = public.current_pasar_id()
  );

-- ---------------------------------------------------------
-- KONTRAK & MUTASI KIOS
-- ---------------------------------------------------------
create policy "kontrak: pedagang lihat kontrak sendiri" on public.kontrak
  for select using (pedagang_id = public.current_pedagang_id());

create policy "kontrak: staf operasional kelola" on public.kontrak
  for all using (
    public.current_role_name() in ('super_admin', 'direksi', 'kepala_pasar', 'bendahara')
  );

create policy "mutasi: staf operasional kelola" on public.mutasi_kios
  for all using (
    public.current_role_name() in ('super_admin', 'direksi', 'kepala_pasar')
  );

-- ---------------------------------------------------------
-- KEUANGAN — hanya staf keuangan/retribusi pasar terkait & admin
-- ---------------------------------------------------------
create policy "retribusi: petugas & bendahara pasar terkait" on public.retribusi_harian
  for all using (public.is_staff_pasar(pasar_id));

create policy "retribusi: pedagang lihat riwayat sendiri" on public.retribusi_harian
  for select using (pedagang_id = public.current_pedagang_id());

create policy "tagihan sewa: staf pasar terkait" on public.tagihan_sewa
  for all using (
    public.is_staff_pasar((
      select p.id
      from public.kontrak k
      left join public.kios ki on ki.id = k.kios_id
      left join public.los lo on lo.id = k.los_id
      join public.blok b on b.id = coalesce(ki.blok_id, lo.blok_id)
      join public.pasar p on p.id = b.pasar_id
      where k.id = tagihan_sewa.kontrak_id
    ))
  );

create policy "kas: staf pasar terkait" on public.kas
  for all using (public.is_staff_pasar(pasar_id));

-- ---------------------------------------------------------
-- PENGADUAN — publik boleh membuat (insert), staf pasar terkait kelola
-- ---------------------------------------------------------
create policy "pengaduan: publik dapat membuat" on public.pengaduan
  for insert with check (true);

create policy "pengaduan: publik lihat status sendiri via kontak" on public.pengaduan
  for select using (true);

create policy "pengaduan: staf pasar kelola" on public.pengaduan
  for update using (public.is_staff_pasar(pasar_id));

-- ---------------------------------------------------------
-- KEBERSIHAN / KEAMANAN / PARKIR — staf pasar terkait & admin
-- ---------------------------------------------------------
create policy "kebersihan: staf pasar terkait" on public.tugas_kebersihan
  for all using (public.is_staff_pasar(pasar_id));

create policy "buku kejadian: staf pasar terkait" on public.buku_kejadian
  for all using (public.is_staff_pasar(pasar_id));

create policy "patroli: staf pasar terkait" on public.patroli
  for all using (public.is_staff_pasar(pasar_id));

create policy "parkir: staf pasar terkait" on public.setoran_parkir
  for all using (public.is_staff_pasar(pasar_id));

-- ---------------------------------------------------------
-- ASET — staf pasar terkait & admin
-- ---------------------------------------------------------
create policy "aset: staf pasar terkait" on public.aset
  for all using (public.is_staff_pasar(pasar_id));

-- ---------------------------------------------------------
-- PROMOSI — publik boleh baca konten aktif, staf pasar & admin kelola
-- ---------------------------------------------------------
create policy "promosi: publik baca yang aktif" on public.promosi
  for select using (aktif = true);

create policy "promosi: staf pasar kelola" on public.promosi
  for all using (
    pasar_id is null
      and public.current_role_name() in ('super_admin', 'direksi')
    or public.is_staff_pasar(pasar_id)
  );
