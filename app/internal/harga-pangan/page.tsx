import { createClient } from "@/lib/supabase/server";
import { HargaPanganForm } from "@/components/internal/harga-pangan-form";

export default async function InternalHargaPanganPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("pasar_id, role")
    .eq("id", user!.id)
    .single();

  const { data: komoditas } = await supabase
    .from("komoditas")
    .select("id, nama, kategori, satuan, urutan")
    .eq("aktif", true)
    .order("urutan");

  const today = new Date().toISOString().slice(0, 10);

  let hargaHariIni: Record<string, number> = {};
  if (profile?.pasar_id) {
    const { data: harga } = await supabase
      .from("harga_komoditas")
      .select("komoditas_id, harga")
      .eq("pasar_id", profile.pasar_id)
      .eq("tanggal", today);

    hargaHariIni = Object.fromEntries(
      (harga ?? []).map((h) => [h.komoditas_id, h.harga])
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-2xl font-semibold">
        Input Harga Bahan Pokok
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Isi harga hari ini ({today}) untuk pasar Anda. Data ini akan tampil
        di dashboard publik dan bisa dilihat masyarakat secara terbuka.
      </p>

      {!profile?.pasar_id ? (
        <p className="mt-8 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Akun Anda belum ditautkan ke pasar tertentu (kolom{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">pasar_id</code>{" "}
          di profil masih kosong). Hubungi Super Admin untuk menautkannya
          terlebih dahulu.
        </p>
      ) : (
        <HargaPanganForm
          pasarId={profile.pasar_id}
          komoditas={komoditas ?? []}
          hargaAwal={hargaHariIni}
          tanggal={today}
        />
      )}
    </main>
  );
}
