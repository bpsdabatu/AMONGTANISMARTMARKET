const roles = [
  { role: "Super Admin", access: "Akses penuh seluruh pasar & konfigurasi sistem" },
  { role: "Direksi Perumda", access: "Dashboard eksekutif seluruh pasar" },
  { role: "Kepala Pasar", access: "Operasional & laporan pasar yang dikelola" },
  { role: "Bendahara", access: "Keuangan, kas, dan laporan pasar" },
  { role: "Petugas Retribusi", access: "Penagihan & pembayaran retribusi harian" },
  { role: "Petugas Kebersihan", access: "Checklist & dokumentasi area kerja" },
  { role: "Petugas Keamanan", access: "Buku kejadian & jadwal patroli" },
  { role: "Petugas Parkir", access: "Setoran & rekap kendaraan per shift" },
  { role: "Pedagang", access: "Data kios, kontrak, dan riwayat pembayaran sendiri" },
  { role: "Pengunjung", access: "Info promosi, event, dan pengaduan publik" },
];

export function RoleAccess() {
  return (
    <section id="peran" className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Hak Akses
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Setiap peran hanya melihat yang jadi urusannya
            </h2>
            <p className="mt-4 text-muted-foreground">
              Row Level Security (RLS) Supabase diterapkan di level basis
              data, bukan hanya di tampilan — sehingga petugas retribusi
              tidak akan pernah melihat data kas bendahara, dan pedagang
              hanya melihat kiosnya sendiri.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {roles.map((r) => (
              <div
                key={r.role}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="text-sm font-semibold">{r.role}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {r.access}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
