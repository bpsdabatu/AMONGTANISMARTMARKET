const methods = [
  {
    name: "Moving Average",
    desc: "Rata-rata pendapatan periode terakhir untuk memuluskan fluktuasi harian.",
  },
  {
    name: "Weighted Moving Average",
    desc: "Bobot lebih besar pada data terbaru agar tren mutakhir lebih terasa.",
  },
  {
    name: "Trend Projection",
    desc: "Proyeksi garis tren linear untuk estimasi pendapatan bulanan & tahunan.",
  },
];

export function AnalyticsPreview() {
  return (
    <section id="analitik" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">
            Modul 11
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Smart Market Analytics
          </h2>
          <p className="mt-4 text-muted-foreground">
            Prediksi pendapatan harian, bulanan, dan tahunan dari data
            transaksi historis — lengkap dengan persentase akurasi, supaya
            Direksi bisa merencanakan target dengan lebih percaya diri.
          </p>

          <div className="mt-8 space-y-4">
            {methods.map((m) => (
              <div key={m.name} className="flex gap-4">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                <div>
                  <div className="text-sm font-semibold">{m.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {m.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Prediksi Pendapatan — Q3</span>
            <span className="font-mono text-xs text-secondary">
              akurasi 91,4%
            </span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2">
            {[38, 52, 46, 61, 58, 70, 66, 74, 80, 77, 88, 92].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm ${
                  i >= 9 ? "bg-gold/70" : "bg-primary/80"
                }`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-primary/80" /> Aktual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm bg-gold/70" /> Prediksi
            </span>
          </div>
          <div className="mt-4 flex justify-between text-xs text-muted-foreground">
            <span>Jan</span>
            <span>Jun</span>
            <span>Des</span>
          </div>
        </div>
      </div>
    </section>
  );
}
