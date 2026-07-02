"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

type Komoditas = {
  id: string;
  nama: string;
  kategori: string;
  satuan: string;
  urutan: number;
};

export function HargaPanganForm({
  pasarId,
  komoditas,
  hargaAwal,
  tanggal,
}: {
  pasarId: string;
  komoditas: Komoditas[];
  hargaAwal: Record<string, number>;
  tanggal: string;
}) {
  const supabase = createClient();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(
      komoditas.map((k) => [k.id, hargaAwal[k.id]?.toString() ?? ""])
    )
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, Komoditas[]> = {};
    for (const k of komoditas) {
      map[k.kategori] = map[k.kategori] ?? [];
      map[k.kategori].push(k);
    }
    return map;
  }, [komoditas]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const rows = Object.entries(values)
      .filter(([, v]) => v !== "" && !Number.isNaN(Number(v)))
      .map(([komoditas_id, v]) => ({
        komoditas_id,
        pasar_id: pasarId,
        harga: Number(v),
        tanggal,
        sumber: "manual" as const,
      }));

    if (rows.length === 0) {
      setSaving(false);
      setError("Isi minimal satu harga sebelum menyimpan.");
      return;
    }

    const { error: upsertError } = await supabase
      .from("harga_komoditas")
      .upsert(rows, { onConflict: "komoditas_id,pasar_id,tanggal" });

    setSaving(false);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {Object.entries(grouped).map(([kategori, items]) => (
        <div key={kategori}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {kategori}
          </h2>
          <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
            {items.map((k) => (
              <div
                key={k.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <label htmlFor={k.id} className="text-sm font-medium">
                  {k.nama}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Rp</span>
                  <input
                    id={k.id}
                    type="number"
                    min={0}
                    step="100"
                    inputMode="numeric"
                    value={values[k.id]}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [k.id]: e.target.value }))
                    }
                    className="w-28 rounded-lg border border-input bg-background px-2 py-1.5 text-right text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="0"
                  />
                  <span className="w-10 text-xs text-muted-foreground">
                    /{k.satuan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Menyimpan..." : "Simpan Harga Hari Ini"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-secondary">
            <CheckCircle2 className="h-4 w-4" />
            Tersimpan
          </span>
        )}
      </div>
    </form>
  );
}
