const items = [
  "Pendapatan retribusi hari ini Rp 48.250.000",
  "Okupansi kios pasar induk 92%",
  "127 pedagang aktif tercatat minggu ini",
  "Tunggakan sewa turun 6% bulan ini",
  "3 pengaduan baru menunggu disposisi",
  "Prediksi pendapatan bulan depan +4,2%",
];

export function Ticker() {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden border-b border-border bg-secondary text-secondary-foreground">
      <div className="flex animate-marquee whitespace-nowrap py-2.5 text-sm font-medium">
        {loop.map((item, i) => (
          <span key={i} className="mx-6 flex items-center gap-6">
            <span className="font-mono text-xs uppercase tracking-wider opacity-70">
              Papan Pasar
            </span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
