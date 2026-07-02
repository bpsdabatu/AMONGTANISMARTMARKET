const stack = [
  { label: "Next.js", role: "Frontend framework" },
  { label: "TypeScript", role: "Type safety" },
  { label: "Tailwind + Shadcn UI", role: "Sistem desain" },
  { label: "Supabase", role: "Database, Auth, Storage, Realtime" },
  { label: "PostgreSQL", role: "Basis data relasional" },
  { label: "Vercel", role: "Hosting & deployment" },
  { label: "QRIS", role: "Integrasi pembayaran" },
];

export function TechStack() {
  return (
    <section id="teknologi" className="border-t border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Dibangun di atas fondasi yang teruji
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-7">
          {stack.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-sm font-semibold">
                {s.label}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {s.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
