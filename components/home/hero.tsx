import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "11", label: "Modul terintegrasi" },
  { value: "10", label: "Peran pengguna" },
  { value: "24/7", label: "Data real-time" },
];

export function Hero() {
  return (
    <section className="market-backdrop relative overflow-hidden border-b border-border">
      <div className="stall-grid-bg absolute inset-0 opacity-[0.35]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            Sistem ERP Pasar Terpadu
          </span>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Satu kios data,
            <br />
            <span className="italic text-primary">seluruh pasar</span>{" "}
            terkelola.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
            AmongTaniSmartMarket menghubungkan pedagang, kios, retribusi, keuangan, hingga
            keamanan pasar dalam satu dashboard — dibangun agar mudah dipakai
            siapa saja, dari Kepala Pasar sampai petugas lapangan.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/harga-pangan">
                Lihat Harga Bahan Pokok
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#modul">
                <PlayCircle className="h-4 w-4" />
                Lihat Semua Modul
              </a>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card/70 backdrop-blur-sm">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-6 text-center">
              <div className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
