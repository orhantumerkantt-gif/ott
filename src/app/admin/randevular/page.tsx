import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { adminZorunlu } from "@/lib/yetki";
import { RANDEVU_DURUM } from "@/lib/sabitler";
import { AdminBaslik, DurumRozeti, tarihSaatBicimi } from "@/components/admin-ui";

export const metadata = { title: "Randevular" };

async function durumDegistir(id: string, formData: FormData) {
  "use server";
  await adminZorunlu();
  const durum = String(formData.get("durum") ?? "");
  if (!(durum in RANDEVU_DURUM)) return;
  await db.booking.update({ where: { id }, data: { durum } });
  revalidatePath("/admin/randevular");
}

export default async function AdminRandevular() {
  const randevular = await db.booking.findMany({
    orderBy: [{ durum: "asc" }, { createdAt: "desc" }],
    include: { order: true },
    take: 200,
  });

  const bekleyen = randevular.filter((r) => r.durum === "TALEP").length;

  return (
    <>
      <AdminBaslik
        baslik="Danışmanlık Randevuları"
        aciklama={
          bekleyen > 0
            ? `${bekleyen} talep yanıt bekliyor.`
            : "Birebir danışmanlık talepleri."
        }
      />

      {randevular.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gece-600 bg-gece-900 p-10 text-center text-sm text-metin3">
          Henüz randevu talebi yok.
        </div>
      ) : (
        <div className="grid gap-3">
          {randevular.map((r) => (
            <article
              key={r.id}
              className={`rounded-2xl border p-5 ${
                r.durum === "TALEP"
                  ? "border-altin-500/40 bg-altin-500/5"
                  : "border-gece-700 bg-gece-850"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-baslik text-[15px] font-bold">{r.adSoyad}</h2>
                    <DurumRozeti durum={r.durum} />
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-metin3">
                    <a href={`mailto:${r.email}`} className="text-altin-400 hover:underline">
                      {r.email}
                    </a>
                    <a href={`tel:${r.telefon}`} className="text-altin-400 hover:underline">
                      {r.telefon}
                    </a>
                    <span>Talep: {tarihSaatBicimi.format(r.createdAt)}</span>
                  </div>
                </div>

                <form action={durumDegistir.bind(null, r.id)} className="flex gap-2">
                  <select
                    name="durum"
                    defaultValue={r.durum}
                    className="rounded-lg border border-gece-600 bg-gece-900 px-3 py-2 text-xs text-metin focus:border-altin-400 focus:outline-none"
                  >
                    <option value="TALEP">Talep</option>
                    <option value="ONAYLANDI">Onaylandı</option>
                    <option value="TAMAMLANDI">Tamamlandı</option>
                    <option value="IPTAL">İptal</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg border border-gece-600 px-3 py-2 text-xs font-medium hover:border-altin-500"
                  >
                    Kaydet
                  </button>
                </form>
              </div>

              <dl className="mt-4 grid gap-3 border-t border-gece-700 pt-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-metin3">Konu</dt>
                  <dd className="mt-1 whitespace-pre-line text-metin2">{r.konu}</dd>
                </div>
                <div>
                  <dt className="text-xs text-metin3">Tercih ettiği zaman</dt>
                  <dd className="mt-1 text-metin2">{r.tercihTarih}</dd>
                </div>
                {r.notlar && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-metin3">Notlar</dt>
                    <dd className="mt-1 whitespace-pre-line text-metin2">{r.notlar}</dd>
                  </div>
                )}
                {r.order && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-metin3">Ödeme</dt>
                    <dd className="mt-1">
                      <DurumRozeti durum={r.order.durum} />
                    </dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
