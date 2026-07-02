import { createBrowserClient } from "@supabase/ssr";

// Catatan: generic <Database> sengaja tidak dipakai di sini karena tipe
// placeholder di types/database.types.ts belum digenerate dari skema
// asli dan menyebabkan inferensi query builder jadi `never`. Setelah
// menjalankan `supabase gen types typescript ...`, generic ini bisa
// ditambahkan kembali: createBrowserClient<Database>(...).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
