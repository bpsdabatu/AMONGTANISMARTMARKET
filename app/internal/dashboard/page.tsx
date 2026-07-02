import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();

  // RLS otomatis membatasi baris yang boleh dilihat sesuai role user
  // yang sedang login — query di bawah ini aman dipakai lintas role.
  const { count: jumlahPasar } = await supabase
    .from("pasar")
    .select("*", { count: "exact", head: true });

  const { count: jumlahPedagang } = await supabase
    .from("pedagang")
    .select("*", { count: "exact", head: true });

  const { count: jumlahKios } = await supabase
    .from("kios")
    .select("*", { count: "exact", head: true });

  const { count: pengaduanBaru } = await supabase
    .from("pengaduan")
    .select("*", { count: "exact", head: true })
    .eq("status", "baru");

  const cards = [
    { label: "Total Pasar", value: jumlahPasar ?? 0 },
    { label: "Total Pedagang", value: jumlahPedagang ?? 0 },
    { label: "Total Kios", value: jumlahKios ?? 0 },
    { label: "Pengaduan Baru", value: pengaduanBaru ?? 0 },
  ];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Dashboard Eksekutif
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan operasional lintas modul.
          </p>
        </div>
        <Link
          href="/internal/harga-pangan"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Input Harga Bahan Pokok Hari Ini
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        Titik awal Modul 10. Tambahkan grafik pendapatan real-time
        (Supabase Realtime), tingkat okupansi, dan statistik pengaduan di
        sini sesuai kebutuhan lanjutan.
      </p>
    </main>
  );
}
