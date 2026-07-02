import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="market-backdrop relative overflow-hidden rounded-3xl border border-border px-8 py-16 text-center md:py-20">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Siap mengelola pasar Anda dengan lebih tenang?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Mulai dari Modul Master Data, aktifkan modul lain kapan pun
          dibutuhkan. Semua data tersinkron secara real-time.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Mulai Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
