# AmongTaniSmartMarket

Sistem ERP terintegrasi untuk mengelola pasar rakyat, pasar daerah, pasar
induk, dan pasar tradisional. Dibangun dengan Next.js, TypeScript,
Tailwind CSS, Shadcn UI, dan Supabase (PostgreSQL, Auth, Storage, Realtime).

## Status Pengerjaan

Repo ini adalah **fondasi production-ready**, bukan seluruh 11 modul yang
sudah selesai 100%. Yang sudah tersedia:

| Bagian | Status |
|---|---|
| Arsitektur & struktur folder Next.js | ✅ Selesai |
| Homepage / landing page publik | ✅ Selesai |
| Desain sistem (tema terang/gelap, token warna, tipografi) | ✅ Selesai |
| Skema database PostgreSQL — Modul 1 (Master Data) | ✅ Selesai |
| Tabel pendukung Modul 2–9 (struktur dasar) | ✅ Selesai |
| RLS Policy untuk seluruh tabel & role | ✅ Selesai |
| Data dummy / seed untuk testing | ✅ Selesai |
| Autentikasi (login, session, middleware) | ✅ Selesai |
| Dashboard eksekutif (Modul 10) — versi awal | 🟡 Starter, perlu grafik & realtime |
| CRUD penuh tiap modul (form tambah/edit/hapus di UI) | ⬜ Belum — struktur data & RLS sudah siap, tinggal dibuat halamannya |
| Modul 11 — Analisis prediktif (server-side) | ⬜ Belum — bagian landing page sudah ada, fungsi hitung prediksi belum |
| Export PDF/Excel/Print | ⬜ Belum |
| Integrasi QRIS aktual | ⬜ Belum — placeholder env var tersedia |

Struktur database & RLS sudah mencakup seluruh 11 modul, jadi menambah
halaman CRUD per modul tinggal mengikuti pola yang sama seperti
`app/dashboard`.

## Struktur Folder

```
amongtanismartmarket/
├── app/
│   ├── page.tsx              # Homepage publik
│   ├── layout.tsx            # Root layout + font + theme provider
│   ├── globals.css           # Design tokens (warna, tipografi)
│   ├── login/page.tsx        # Halaman login
│   └── dashboard/page.tsx    # Dashboard eksekutif (starter Modul 10)
├── components/
│   ├── layout/                # Navbar, Footer
│   ├── home/                  # Section-section homepage
│   ├── ui/                    # Komponen dasar (Button, dst — gaya Shadcn)
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── supabase/               # Client browser, server, middleware
│   └── utils.ts
├── supabase/
│   ├── schema.sql              # Skema tabel semua modul
│   ├── rls.sql                 # Row Level Security policies
│   └── seed.sql                # Data dummy untuk testing
├── types/database.types.ts     # Tipe TypeScript (generate ulang dari Supabase)
├── public/images/market-hero.jpg
└── middleware.ts                # Refresh session Supabase di setiap request
```

## Instalasi Lokal

1. **Clone & install dependencies**
   ```bash
   git clone <url-repo-anda>
   cd amongtanismartmarket
   npm install
   ```

2. **Siapkan Supabase**
   - Buat project baru di [supabase.com](https://supabase.com)
   - Buka **SQL Editor**, jalankan berurutan:
     1. `supabase/schema.sql`
     2. `supabase/rls.sql`
     3. `supabase/seed.sql` (opsional, untuk data uji coba)

3. **Salin environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari
   **Project Settings → API** di dashboard Supabase.

4. **Jalankan development server**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000)

5. **Buat user pertama (Super Admin)**
   - Daftar lewat halaman `/login` menggunakan `supabase.auth.signUp`
     (atau tambahkan lewat Supabase Dashboard → Authentication → Users)
   - Di tabel `profiles`, ubah kolom `role` user tersebut menjadi
     `super_admin` lewat SQL Editor:
     ```sql
     update public.profiles set role = 'super_admin' where id = '<user-id>';
     ```

Untuk panduan deploy ke GitHub + Vercel, lihat [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Menambahkan Foto/Gambar Tambahan

Folder `public/images/` sudah berisi `market-hero.jpg` yang dipakai sebagai
latar belakang hero (opacity ~50% lewat overlay gradient di
`app/globals.css`, class `.market-backdrop`). Untuk menambah foto lain
(banner promosi, foto kios, foto pedagang):

- Foto statis desain (logo, ilustrasi): taruh di `public/images/`
- Foto dinamis milik user (foto pedagang, dokumentasi pengaduan/kebersihan/
  keamanan): upload ke **Supabase Storage**, bukan folder `public/`, karena
  perlu terhubung ke RLS dan bisa diunggah langsung dari form.
  Buat bucket baru, contoh:
  ```sql
  insert into storage.buckets (id, name, public) values ('foto-pengaduan', 'foto-pengaduan', true);
  ```

## QA Checklist (Awal)

- [ ] `npm run build` sukses tanpa error
- [ ] `npm run typecheck` sukses
- [ ] Login/logout berjalan, session bertahan setelah refresh
- [ ] RLS: user role `pedagang` tidak bisa melihat data pedagang lain
- [ ] RLS: `petugas_retribusi` tidak bisa mengakses tabel `kas`
- [ ] Homepage responsif di layar 375px, 768px, 1440px
- [ ] Dark mode & light mode konsisten di semua komponen
- [ ] Gambar hero termuat dan overlay transparansi terlihat jelas di kedua tema
- [ ] Environment variable tidak ter-commit ke repo (`.env.local` di `.gitignore`)

## Lisensi

Internal — AmongTaniSmartMarket dikembangkan untuk kebutuhan Perumda Pasar.
