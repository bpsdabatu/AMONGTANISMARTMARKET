import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/theme-toggle";

// Peran yang boleh mengakses dashboard internal (BLUD, OPD, Pemda).
// Pedagang & pengunjung tidak masuk sini — mereka memakai halaman publik.
const STAFF_ROLES = [
  "super_admin",
  "direksi",
  "kepala_pasar",
  "bendahara",
  "petugas_retribusi",
  "petugas_kebersihan",
  "petugas_keamanan",
  "petugas_parkir",
];

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, nama")
    .eq("id", user.id)
    .single();

  if (!profile || !STAFF_ROLES.includes(profile.role)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/internal/dashboard" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-4 w-4" />
            </span>
            <span className="font-display text-sm font-semibold">
              AmongTani<span className="text-primary">SmartMarket</span>{" "}
              <span className="text-muted-foreground">· Internal</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {profile.nama} · <span className="capitalize">{profile.role.replace(/_/g, " ")}</span>
            </span>
            <ThemeToggle />
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium hover:bg-muted"
              >
                <LogOut className="h-3.5 w-3.5" />
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
