import type { Metadata } from "next";
import { Download, Monitor, Package } from "lucide-react";
import { db } from "@/lib/db";
import { kurusTL, fiyatlar } from "@/lib/site";
import { BolumBasligi, ButonLink, Rozet } from "@/components/ui";

export const metadata: Metadata = {
  title: "Yazılımlar",
  description:
    "Video üretim hattı, kapak üretici ve telif kontrol araçları. Sosyal medya " +
    "üretimini otomatikleştiren, kendi geliştirdiğim yazılımlar.",
  alternates: { canonical: "/yazilimlar" },
};

export default async function YazilimlarSayfasi() {
  const yazilimlar = await db.software.findMany({
    where: { yayinda: true },
    orderBy: [{ sira: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <section className="kapsayici py-16">
        <BolumBasligi
          ustBaslik="Yazılımlar"
          baslik="İşin teknik kısmını yazılım yapsın"
          aciklama="Kendi üretim hattımda kullandığım araçları senin için paketledim. Tek tek satın alabilir ya da abonelikle hepsine erişebilirsin."
        />

        {yazilimlar.length === 0 ? (
          <p className="mt-12 text-center text-metin2">
            Şu anda yayında yazılım bulunmuyor. Çok yakında!
          </p>
        ) : (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {yazilimlar.map((y) => (
              <article
                key={y.id}
                className="flex flex-col rounded-2xl border border-gece-700 bg-gece-850 p-6 transition-colors hover:border-altin-600"
              >
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-altin-500/10">
                  <Package size={22} className="text-altin-400" />
                </div>

                <h2 className="font-baslik text-lg font-bold">{y.ad}</h2>
                <p className="mt-2 text-sm text-metin3">{y.kisaAciklama}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-metin2">
                  {y.aciklama}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-metin3">
                  <span className="inline-flex items-center gap-1.5">
                    <Monitor size={13} /> {y.platform}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Download size={13} /> Sürüm {y.surum}
                  </span>
                </div>

                {y.abonelikDahil && (
                  <div className="mt-4">
                    <Rozet>Abonelikte dahil</Rozet>
                  </div>
                )}

                <div className="mt-5 flex items-end justify-between gap-3 border-t border-gece-700 pt-5">
                  <b className="font-baslik text-xl font-extrabold">
                    {kurusTL(y.fiyatKurus)}
                  </b>
                  <ButonLink
                    href={`/odeme/yazilim/${y.slug}`}
                    tur="ikincil"
                    className="px-4 py-2.5 text-[13px]"
                  >
                    Satın Al
                  </ButonLink>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="kapsayici pb-20">
        <div className="rounded-3xl border border-altin-500/30 bg-gradient-to-br from-gece-850 to-gece-800 p-8 text-center lg:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Tüm yazılımlar abonelikte dahil
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-metin2">
            Tek tek satın almak yerine aylık abonelikle hem yazılımların hepsine hem de
            tüm eğitimlere erişebilirsin.
          </p>
          <div className="mt-7 flex justify-center">
            <ButonLink href="/abonelik">
              Aboneliği Başlat — {kurusTL(fiyatlar.abonelikAylikKurus)}/ay
            </ButonLink>
          </div>
        </div>
      </section>
    </>
  );
}
