import {
  Database,
  Users,
  Wallet,
  MessageSquareWarning,
  SprayCan,
  ShieldCheck,
  CarFront,
  Boxes,
  Megaphone,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";

const modules = [
  {
    no: "01",
    title: "Master Data",
    desc: "Pasar, blok, kios, los, pedagang, dan pegawai dalam satu basis data terstruktur.",
    icon: Database,
  },
  {
    no: "02",
    title: "Manajemen Pedagang",
    desc: "Registrasi, penempatan kios, kontrak, mutasi, hingga status aktif pedagang.",
    icon: Users,
  },
  {
    no: "03",
    title: "Keuangan",
    desc: "Retribusi harian, sewa kios, utilitas, kas, dan laporan neraca-laba rugi.",
    icon: Wallet,
  },
  {
    no: "04",
    title: "Pengaduan",
    desc: "Tiket masuk, disposisi petugas, dan pelacakan status penyelesaian.",
    icon: MessageSquareWarning,
  },
  {
    no: "05",
    title: "Kebersihan",
    desc: "Jadwal petugas, checklist harian, dan dokumentasi foto per area kerja.",
    icon: SprayCan,
  },
  {
    no: "06",
    title: "Keamanan",
    desc: "Jadwal shift, buku kejadian, patroli, dan laporan insiden.",
    icon: ShieldCheck,
  },
  {
    no: "07",
    title: "Parkir",
    desc: "Setoran harian, rekap kendaraan, dan pendapatan parkir per shift.",
    icon: CarFront,
  },
  {
    no: "08",
    title: "Aset",
    desc: "Inventaris, kategori, lokasi, kondisi, dan penyusutan aset pasar.",
    icon: Boxes,
  },
  {
    no: "09",
    title: "Promosi Pasar",
    desc: "Banner, event, berita, dan pengumuman untuk pengunjung pasar.",
    icon: Megaphone,
  },
  {
    no: "10",
    title: "Dashboard Eksekutif",
    desc: "Pendapatan real-time, okupansi, tunggakan, dan statistik operasional.",
    icon: LayoutDashboard,
  },
  {
    no: "11",
    title: "Smart Market Analytics",
    desc: "Prediksi pendapatan harian, bulanan, tahunan berbasis data historis.",
    icon: TrendingUp,
  },
];

export function ModulesGrid() {
  return (
    <section id="modul" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Denah Sistem
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Sebelas blok modul, tersusun seperti pasar sungguhan
        </h2>
        <p className="mt-4 text-muted-foreground">
          Setiap modul berdiri sendiri seperti blok di pasar — bisa
          dikembangkan dan diaktifkan bertahap sesuai kebutuhan unit
          Perumda Pasar Anda.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <div
            key={m.no}
            className="group relative flex flex-col gap-4 bg-card p-7 transition-colors hover:bg-muted/60"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <m.icon className="h-5 w-5" />
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                BLOK {m.no}
              </span>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">
                {m.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
