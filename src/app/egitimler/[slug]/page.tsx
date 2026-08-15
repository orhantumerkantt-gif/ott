import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Layers, PlayCircle, Lock, Check } from "lucide-react";
import { db } from "@/lib/db";
import { kurusTL, site, fiyatlar } from "@/lib/site";
import { SEVIYE_ETIKET } from "@/lib/sabitler";
import { ButonLink, Rozet } from "@/components/ui";
import { oturumVarsa, egitimErisimi } from "@/lib/yetki";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const kurs = await db.course.findUnique({ where: { slug } });
  if (!kurs) return { title: "Eğitim bulunamadı" };

  return {
    title: kurs.seoBaslik ?? kurs.baslik,
    description: kurs.seoAciklama ?? kurs.altBaslik ?? kurs.aciklama.slice(0, 155),
    alternates: { canonical: `/egitimler/${kurs.slug}` },
  };
}

export default async function EgitimDetay({ params }: Props) {
  const { slug } = await params;
  const kurs = await db.course.findUnique({
    where: { slug },
    include: { dersler: { orderBy: { sira: "asc" } } },
  });

  if (!kurs || !kurs.yayinda) notFound();

  const kullanici = await oturumVarsa();
  const erisimVar = kullanici ? await egitimErisimi(kullanici.id, kurs.id) : false;

  const toplamDk = kurs.dersler.reduce((t, d) => t + d.sureDk, 0) || kurs.sureDk;

  return (
    <>
      <section className="kapsayici py-12">
        <Link
          href="/egitimler"
          className="inline-flex items-center gap-2 text-sm text-metin2 hover:text-altin-400"
        >
          <ArrowLeft size={15} /> Tüm eğitimler
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Sol: tanıtım */}
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Rozet>{SEVIYE_ETIKET[kurs.seviye] ?? kurs.seviye}</Rozet>
              {kurs.abonelikDahil && <Rozet>Abonelikte dahil</Rozet>}
            </div>

            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              {kurs.baslik}
            </h1>
            {kurs.altBaslik && (
              <p className="mt-3 text-lg text-metin2">{kurs.altBaslik}</p>
            )}

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-metin3">
              <span className="inline-flex items-center gap-1.5">
                <Layers size={14} /> {kurs.dersler.length} ders
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} /> {Math.round(toplamDk / 60)} saat içerik
              </span>
            </div>

            <div className="mt-8 rounded-2xl border border-gece-700 bg-gece-850 p-6">
              <h2 className="font-baslik text-lg font-bold">Bu eğitimde ne var?</h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-metin2">
                {kurs.aciklama}
              </p>
            </div>

            {/* Ders listesi */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-gece-700 bg-gece-850">
              <h2 className="border-b border-gece-700 p-5 font-baslik text-lg font-bold">
                Ders içeriği
              </h2>
              <ol className="divide-y divide-gece-700">
                {kurs.dersler.map((d, i) => {
                  const acik = erisimVar || d.ucretsizOnizleme;
                  return (
                    <li
                      key={d.id}
                      className="flex items-center gap-4 p-4 text-sm sm:px-5"
                    >
                      <span className="w-6 shrink-0 text-center font-baslik text-xs text-metin3">
                        {i + 1}
                      </span>
                      {acik ? (
                        <PlayCircle size={17} className="shrink-0 text-altin-400" />
                      ) : (
                        <Lock size={15} className="shrink-0 text-metin3" />
                      )}
                      <span className={acik ? "flex-1 text-metin" : "flex-1 text-metin2"}>
                        {d.baslik}
                        {d.ucretsizOnizleme && !erisimVar && (
                          <span className="ml-2 rounded bg-basari/15 px-2 py-0.5 text-[10px] font-semibold text-basari">
                            ÜCRETSİZ
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-xs text-metin3">{d.sureDk} dk</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Sağ: satın alma kutusu */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-gece-700 bg-gece-850 p-6">
              {erisimVar ? (
                <>
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-basari">
                    <Check size={17} /> Bu eğitime erişimin var
                  </div>
                  <ButonLink href={`/panel/egitimlerim/${kurs.slug}`} className="w-full">
                    Eğitime Devam Et
                  </ButonLink>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    {kurs.eskiFiyatKurus && kurs.eskiFiyatKurus > kurs.fiyatKurus && (
                      <span className="text-base text-metin3 line-through">
                        {kurusTL(kurs.eskiFiyatKurus)}
                      </span>
                    )}
                    <b className="font-baslik text-4xl font-extrabold">
                      {kurusTL(kurs.fiyatKurus)}
                    </b>
                  </div>
                  <p className="mt-1 text-xs text-metin3">Tek seferlik · Ömür boyu erişim</p>

                  <div className="mt-6 grid gap-2.5">
                    <ButonLink href={`/odeme/egitim/${kurs.slug}`} className="w-full">
                      Satın Al
                    </ButonLink>
                    <ButonLink href="/abonelik" tur="ikincil" className="w-full">
                      Abonelikle hepsine eriş
                    </ButonLink>
                  </div>

                  <ul className="mt-6 grid gap-2.5 border-t border-gece-700 pt-5 text-[13px] text-metin2">
                    <li className="flex gap-2.5">
                      <span className="text-altin-400">✓</span> Ömür boyu erişim
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-altin-400">✓</span> Güncellemeler ücretsiz
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-altin-400">✓</span> Kaynak dosyalar dahil
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-altin-400">✓</span> 3D Secure güvenli ödeme
                    </li>
                  </ul>
                </>
              )}
            </div>
          </aside>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: kurs.baslik,
            description: kurs.aciklama,
            provider: { "@type": "Person", name: site.tamAd, url: site.url },
            offers: {
              "@type": "Offer",
              price: (kurs.fiyatKurus / 100).toFixed(2),
              priceCurrency: "TRY",
              availability: "https://schema.org/InStock",
              url: `${site.url}/egitimler/${kurs.slug}`,
            },
          }),
        }}
      />
    </>
  );
}
