# Panduan Membuat Akun Staf (Login Username)

Supabase Auth secara teknis tetap berbasis email di baliknya, tapi staf
**login pakai username**, bukan email — email hanya dipakai secara
internal dan tidak perlu benar-benar aktif/dipakai untuk menerima surel.

## Cara 1 — Lewat Supabase Dashboard (paling mudah)

1. Buka **Authentication → Users → Add User**.
2. Isi **Email** dengan pola internal, contoh:
   `kepala.pasarinduk@akun.amongtanismartmarket.local`
   (tidak perlu domain nyata — hanya dipakai Supabase Auth secara internal).
3. Isi **Password** sesuai kebijakan instansi Anda.
4. Setelah user dibuat, buka **Table Editor → profiles**, cari baris dengan
   `id` yang sama dengan user tadi (otomatis dibuat oleh trigger), lalu isi:
   - `username` → contoh: `kepala.pasarinduk` (huruf kecil, angka, titik,
     garis bawah — 3 sampai 32 karakter)
   - `nama` → nama lengkap
   - `role` → salah satu dari: `super_admin`, `direksi`, `kepala_pasar`,
     `bendahara`, `petugas_retribusi`, `petugas_kebersihan`,
     `petugas_keamanan`, `petugas_parkir`, `pedagang`, `pengunjung`
   - `pasar_id` → wajib diisi untuk role yang dibatasi ke satu pasar
     (Kepala Pasar, Bendahara, Petugas Retribusi/Kebersihan/Keamanan/Parkir)

## Cara 2 — Lewat SQL (untuk beberapa akun sekaligus)

```sql
-- 1) Buat user di auth.users lewat Supabase Dashboard/API terlebih dahulu
--    (tidak bisa langsung insert manual ke auth.users lewat SQL Editor biasa)

-- 2) Setelah user ada, update profil-nya:
update public.profiles
set
  username = 'kepala.pasarinduk',
  nama = 'Hendra Kusuma',
  role = 'kepala_pasar',
  pasar_id = (select id from public.pasar where kode_pasar = 'PSR-001')
where id = '<uuid-user-dari-auth.users>';
```

## Konvensi Penamaan Username

| Peran | Contoh username |
|---|---|
| Super Admin | `admin.smm` |
| Direksi | `direksi.dirut`, `direksi.diroperasional` |
| Kepala Pasar | `kepala.<kode_pasar>` → `kepala.psr001` |
| Bendahara | `bendahara.<kode_pasar>` |
| Petugas Retribusi | `retribusi.<kode_pasar>.1`, `.2` (jika lebih dari 1 shift) |
| Petugas Kebersihan | `kebersihan.<kode_pasar>` |
| Petugas Keamanan | `keamanan.<kode_pasar>.pagi` / `.malam` |
| Petugas Parkir | `parkir.<kode_pasar>.pagi` / `.malam` |

Konsisten menjaga penamaan seperti ini memudahkan audit siapa mengakses
apa, terutama untuk log di tabel `buku_kejadian`, `kas`, dan `retribusi_harian`.

## Uji Coba Login

Setelah `username`, `role`, dan `pasar_id` terisi, staf bisa langsung
login di `/login` menggunakan **username** (bukan email) yang tadi
ditentukan, dan password yang dibuat di Cara 1 langkah 3.
