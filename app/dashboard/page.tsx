import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Contoh query awal Modul 10 — Dashboard Eksekutif.
  // Ganti/tambahkan query sesuai kebutuhan setiap peran (RLS akan
  // otomatis membatasi baris yang boleh dilihat masing-masing role).
  const { count: jumlahPasar } = await supabase
    .from("pasar")
    .select("*", { count: "exact", head: true });

  const { count: jumlahPedagang } = await supabase
    .from("pedagang")
    .select("*", { count: "exact", head: true });

  const { count: jumlahKios } = await supabase
    .from("kios")
    .select("*", { count: "exact", head: true });

  const cards = [
    { label: "Total Pasar", value: jumlahPasar ?? 0 },
    { label: "Total Pedagang", value: jumlahPedagang ?? 0 },
    { label: "Total Kios", value: jumlahKios ?? 0 },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold">
        Dashboard Eksekutif
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Masuk sebagai {user.email}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-6">
            <div className="text-sm text-muted-foreground">{c.label}</div>
            <div className="mt-2 font-display text-3xl font-semibold">
              {c.value}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Ini adalah titik awal Modul 10. Tambahkan grafik pendapatan
        real-time (Supabase Realtime), tingkat okupansi, dan statistik
        pengaduan di halaman ini sesuai kebutuhan lanjutan.
      </p>
    </main>
  );
}
