import { Store } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-4 w-4" />
            </span>
            <span className="font-display text-sm font-semibold">
              AmongTaniSmartMarket
            </span>
          </div>
          <p className="text-center text-xs text-muted-foreground md:text-right">
            Dibangun untuk Perumda Pasar — pasar rakyat, pasar daerah, pasar
            induk, dan pasar tradisional.
            <br />© {new Date().getFullYear()} AmongTaniSmartMarket. Seluruh hak cipta
            dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
