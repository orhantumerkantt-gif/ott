import { Mail, MailOpen } from "lucide-react";
import { db } from "@/lib/db";
import { adminZorunlu } from "@/lib/yetki";
import { revalidatePath } from "next/cache";
import { AdminBaslik, tarihSaatBicimi } from "@/components/admin-ui";

export const metadata = { title: "Mesajlar" };

async function okunduIsaretle(id: string, okundu: boolean) {
  "use server";
  await adminZorunlu();
  await db.lead.update({ where: { id }, data: { okundu } });
  revalidatePath("/admin/mesajlar");
}

export default async function AdminMesajlar() {
  const mesajlar = await db.lead.findMany({
    orderBy: [{ okundu: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  const okunmamis = mesajlar.filter((m) => !m.okundu).length;

  return (
    <>
      <AdminBaslik
        baslik="Mesajlar"
        aciklama={
          okunmamis > 0
            ? `${okunmamis} okunmamış mesaj var.`
            : "İletişim formundan gelen mesajlar."
        }
      />

      {mesajlar.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gece-600 bg-gece-900 p-10 text-center text-sm text-metin3">
          Henüz mesaj yok.
        </div>
      ) : (
        <div className="grid gap-3">
          {mesajlar.map((m) => (
            <article
              key={m.id}
              className={`rounded-2xl border p-5 ${
                m.okundu
                  ? "border-gece-700 bg-gece-850"
                  : "border-iz-500/40 bg-iz-500/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-baslik text-[15px] font-bold">{m.adSoyad}</h2>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-metin3">
                    <a href={`mailto:${m.email}`} className="text-altin-400 hover:underline">
                      {m.email}
                    </a>
                    {m.telefon && <span>{m.telefon}</span>}
                    <span>{tarihSaatBicimi.format(m.createdAt)}</span>
                  </div>
                </div>

                <form action={okunduIsaretle.bind(null, m.id, !m.okundu)}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gece-600 px-3 py-1.5 text-xs font-medium text-metin2 hover:border-altin-500 hover:text-metin"
                  >
                    {m.okundu ? (
                      <>
                        <Mail size={13} /> Okunmadı yap
                      </>
                    ) : (
                      <>
                        <MailOpen size={13} /> Okundu
                      </>
                    )}
                  </button>
                </form>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-metin2">
                {m.mesaj}
              </p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
