import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { db } from "@/lib/db";
import { BolumBasligi } from "@/components/ui";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "YouTube algoritması, yapay zekâ ile içerik üretimi ve sosyal medyada para " +
    "kazanma üzerine yazılar.",
  alternates: { canonical: "/blog" },
};

const tarihBicimi = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function BlogSayfasi() {
  const yazilar = await db.post.findMany({
    where: { yayinda: true },
    orderBy: { yayinTarihi: "desc" },
  });

  return (
    <section className="kapsayici py-16">
      <BolumBasligi
        ustBaslik="Blog"
        baslik="Denediklerim, ölçtüklerim, öğrendiklerim"
        aciklama="Kanallarımda uyguladığım yöntemleri ve sonuçlarını burada paylaşıyorum."
      />

      {yazilar.length === 0 ? (
        <p className="mt-12 text-center text-metin2">Yakında ilk yazı burada olacak.</p>
      ) : (
        <div className="mx-auto mt-12 grid max-w-4xl gap-5">
          {yazilar.map((y) => (
            <article
              key={y.id}
              className="rounded-2xl border border-gece-700 bg-gece-850 p-6 transition-colors hover:border-altin-600 sm:p-8"
            >
              <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-metin3">
                {y.yayinTarihi && (
                  <time dateTime={y.yayinTarihi.toISOString()}>
                    {tarihBicimi.format(y.yayinTarihi)}
                  </time>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={12} /> {y.okumaDk} dk okuma
                </span>
              </div>

              <h2 className="font-baslik text-xl font-bold leading-snug sm:text-2xl">
                <Link href={`/blog/${y.slug}`} className="hover:text-altin-400">
                  {y.baslik}
                </Link>
              </h2>

              <p className="mt-3 text-[15px] leading-relaxed text-metin2">{y.ozet}</p>

              {y.etiketler && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {y.etiketler.split(",").map((e) => (
                    <span
                      key={e}
                      className="rounded-full border border-gece-600 px-3 py-1 text-[11px] text-metin3"
                    >
                      {e.trim()}
                    </span>
                  ))}
                </div>
              )}

              <Link
                href={`/blog/${y.slug}`}
                className="mt-5 inline-block text-sm font-semibold text-altin-400 hover:underline"
              >
                Yazının tamamını oku →
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
