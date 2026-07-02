"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/harga-pangan", label: "Harga Pangan" },
  { href: "/#modul", label: "Modul" },
  { href: "/#peran", label: "Peran Pengguna" },
  { href: "/#analitik", label: "Analitik" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Store className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            AmongTani<span className="text-primary">SmartMarket</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Login Internal</Link>
          </Button>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Buka menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium">
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-2">
              <ThemeToggle />
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/login">Login Internal</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
