import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { createClient } from "@/lib/supabase/server";
import { Info } from "lucide-react";

type HargaRow = {
  komoditas_id: string;
  nama: string;
  kategori: string;
  satuan: string;
  urutan: number;
  harga_rata_rata: number;
  tanggal: string;
  sumber: string;
};

export const revalidate = 300; // refresh tiap 5 menit

export default async function HargaPanganPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("harga_terkini")
    .select("*")
    .order("urutan");

  const rows = (data ?? []) as HargaRow[];
  const grouped: Record<string, HargaRow[]> = {};
  for (const r of rows) {
    grouped[r.kategori] = grouped[r.kategori] ?? [];
    grouped[r.kategori].push(r);
  }

  const tanggalTerbaru = rows.length
    ? new Date(
        rows.reduce((a, b) => (a.tanggal > b.tanggal ? a : b)).tanggal
      ).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Dashboard Publik
          </span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Harga Bahan Pokok
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Informasi harga bahan pokok di pasar yang terhubung dengan
            AmongTaniSmartMarket, dapat diakses bebas oleh masyarakat.
          </p>
          {tanggalTerbaru && (
            <p className="mt-2 text-sm text-muted-foreground">
              Data per {tanggalTerbaru}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-muted/50 p-4 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Harga dicatat manual oleh petugas pasar setiap hari (rata-rata
            antar pasar yang melapor). Bukan data resmi Siskaperbapo
            Pemprov Jatim — untuk pembanding, kunjungi{" "}
            <a
              href="https://siskaperbapo.jatimprov.go.id/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline underline-offset-2"
            >
              siskaperbapo.jatimprov.go.id
            </a>
            .
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Belum ada data harga yang diinput hari ini. Silakan kembali
            lagi nanti.
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            {Object.entries(grouped).map(([kategori, items]) => (
              <div key={kategori}>
                <h2 className="font-display text-lg font-semibold">
                  {kategori}
                </h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-border">
                      {items.map((r) => (
                        <tr key={r.komoditas_id} className="bg-card">
                          <td className="px-5 py-3.5 font-medium">
                            {r.nama}
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono tabular-nums">
                            Rp{Number(r.harga_rata_rata).toLocaleString("id-ID")}
                          </td>
                          <td className="w-16 px-5 py-3.5 text-right text-xs text-muted-foreground">
                            /{r.satuan}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
