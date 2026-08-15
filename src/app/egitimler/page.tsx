import type { Metadata } from "next";
import Link from "next/link";
import { Clock, PlayCircle, Layers } from "lucide-react";
import { db } from "@/lib/db";
import { kurusTL, site, fiyatlar } from "@/lib/site";
import { SEVIYE_ETIKET } from "@/lib/sabitler";
import { BolumBasligi, ButonLink, Rozet } from "@/components/ui";

export const metadata: Metadata = {
  title: "Eğitim Setleri",
  description:
    "YouTube kanalı kurma, yapay zekâ ile içerik üretimi, Shorts büyüme ve gelir " +
    "modelleri üzerine baştan sona yapılandırılmış video eğitimler.",
  alternates: { canonical: "/egitimler" },
};

export default async function EgitimlerSayfasi() {
  const egitimler = await db.course.findMany({
    where: { yayinda: true },
    orderBy: [{ sira: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { dersler: true } } },
  });

  return (
    <>
      <section className="kapsayici py-16">
        <BolumBasligi
          ustBaslik="Eğitim Setleri"
          baslik="Tek konuya odaklan, sonuna kadar götür"
          aciklama="Her eğitim tek bir konuyu baştan sona ele alır. Bir kez satın alırsın, ömür boyu senindir — güncellemeler dahil."
        />

        {egitimler.length === 0 ? (
          <p className="mt-12 text-center text-metin2">
            Şu anda yayında eğitim bulunmuyor. Çok yakında!
          </p>
        ) : (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {egitimler.map((e) => (
              <article
                key={e.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-gece-700 bg-gece-850 transition-colors hover:border-altin-600"
              >
                <div className="relative grid aspect-video place-items-center border-b border-gece-700 bg-gradient-to-br from-gece-800 to-gece-900">
                  <PlayCircle size={40} className="text-altin-500/40" />
                  {e.oneCikan && (
                    <span className="absolute left-4 top-4 rounded-full bg-altin-400 px-3 py-1 text-[10px] font-bold tracking-wider text-gece-950">
                      ÖNE ÇIKAN
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Rozet>{SEVIYE_ETIKET[e.seviye] ?? e.seviye}</Rozet>
                  </div>

                  <h2 className="font-baslik text-lg font-bold leading-snug">
                    <Link href={`/egitimler/${e.slug}`} className="hover:text-altin-400">
                      {e.baslik}
                    </Link>
                  </h2>
                  {e.altBaslik && (
                    <p className="mt-1.5 text-sm text-metin3">{e.altBaslik}</p>
                  )}

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-metin2 line-clamp-3">
                    {e.aciklama}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-metin3">
                    <span className="inline-flex items-center gap-1.5">
                      <Layers size={13} /> {e._count.dersler} ders
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} /> {Math.round(e.sureDk / 60)} saat
                    </span>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-3 border-t border-gece-700 pt-5">
                    <div>
                      {e.eskiFiyatKurus && e.eskiFiyatKurus > e.fiyatKurus && (
                        <span className="mr-2 text-sm text-metin3 line-through">
                          {kurusTL(e.eskiFiyatKurus)}
                        </span>
                      )}
                      <b className="font-baslik text-xl font-extrabold">
                        {kurusTL(e.fiyatKurus)}
                      </b>
                    </div>
                    <ButonLink
                      href={`/egitimler/${e.slug}`}
                      tur="ikincil"
                      className="px-4 py-2.5 text-[13px]"
                    >
                      İncele
                    </ButonLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Abonelik yönlendirmesi: tek tek almak yerine hepsini al */}
      <section className="kapsayici pb-20">
        <div className="rounded-3xl border border-altin-500/30 bg-gradient-to-br from-gece-850 to-gece-800 p-8 text-center lg:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Hepsini birden istiyorsan
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-metin2">
            Aylık abonelikle yukarıdaki eğitimlerin <strong className="text-metin">tamamına</strong>,
            tüm yazılımlara ve yeni çıkan her içeriğe erişirsin.
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
