# Panduan Deployment — AmongTaniSmartMarket

Urutan yang disarankan: **Supabase → GitHub → Vercel**.

## 1. Supabase (Database & Auth)

1. Buat project di [supabase.com](https://app.supabase.com) → catat
   **Project URL** dan **anon public key** (Project Settings → API).
2. Buka **SQL Editor**, jalankan berurutan:
   - `supabase/schema.sql`
   - `supabase/rls.sql`
   - `supabase/seed.sql` (opsional, hanya untuk lingkungan staging/testing —
     **jangan** jalankan di production dengan data asli)
3. Aktifkan **Email Auth** di Authentication → Providers (default sudah aktif).
4. (Opsional) Jika ingin generate ulang tipe TypeScript dari skema:
   ```bash
   npx supabase login
   npx supabase gen types typescript --project-id <PROJECT_ID> --schema public > types/database.types.ts
   ```

## 2. GitHub

```bash
cd amongtanismartmarket
git init
git add .
git commit -m "Initial commit: AmongTaniSmartMarket foundation"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

Pastikan `.env.local` **tidak ikut ter-commit** (sudah ada di `.gitignore`).

## 3. Vercel

1. Buka [vercel.com/new](https://vercel.com/new), import repository GitHub
   yang baru dibuat.
2. Framework preset akan otomatis terdeteksi sebagai **Next.js**.
3. Tambahkan Environment Variables (Project Settings → Environment Variables),
   isi persis seperti `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (hanya jika dipakai di server actions/API routes)
4. Klik **Deploy**.
5. Setelah live, buka **Supabase → Authentication → URL Configuration**,
   tambahkan domain Vercel Anda (`https://your-app.vercel.app`) ke
   **Site URL** dan **Redirect URLs** agar login berfungsi di production.

## 4. Deploy Ulang (setelah ada perubahan kode)

```bash
git add .
git commit -m "Deskripsi perubahan"
git push
```

Vercel otomatis membangun ulang setiap ada push ke branch `main`
(continuous deployment).

## 5. Perubahan Skema Database di Kemudian Hari

Simpan setiap perubahan skema sebagai file SQL baru di `supabase/migrations/`,
beri nama berurutan, contoh: `0002_tambah_kolom_diskon_retribusi.sql`.
Jalankan manual lewat SQL Editor, atau gunakan Supabase CLI
(`supabase migration up`) jika sudah menghubungkan project lokal dengan
`supabase link`.

### Migrasi 0002 — Login Username & Harga Bahan Pokok

Jika project Anda **sudah live** (sudah menjalankan `schema.sql` +
`rls.sql` sebelumnya), jalankan file ini satu kali di **SQL Editor**
Supabase:

```
supabase/migrations/0002_username_dan_harga_pangan.sql
```

Migrasi ini menambahkan:
- Kolom `username` di `profiles` + fungsi `email_for_username()` agar staf
  bisa login pakai username, bukan email
- Tabel `komoditas` dan `harga_komoditas` untuk dashboard publik harga
  bahan pokok, lengkap dengan RLS dan 15 komoditas awal

Setelah itu, ikuti `supabase/PANDUAN_AKUN_STAF.md` untuk membuat akun
staf dengan username.
