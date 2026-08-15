import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, PlayCircle, Lock, Clock, Video } from "lucide-react";
import { db } from "@/lib/db";
import { oturumZorunlu, egitimErisimi } from "@/lib/yetki";
import { Uyari, ButonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Eğitim",
  robots: { index: false, follow: false },
};

/**
 * YouTube/Vimeo bağlantısını gömme (embed) adresine çevirir.
 * Orhan panele normal izleme bağlantısını yapıştırabilsin diye —
 * "embed adresi kullan" demek gereksiz teknik yük olurdu.
 */
function gommeAdresi(url: string): string | null {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url;
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      if (u.hostname.startsWith("player.")) return url;
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  } catch {
    return null;
  }
}

export default async function DersIzleme({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ders?: string }>;
}) {
  const { slug } = await params;
  const { ders: dersId } = await searchParams;

  const kullanici = await oturumZorunlu(`/panel/egitimlerim/${slug}`);

  const kurs = await db.course.findUnique({
    where: { slug },
    include: { dersler: { orderBy: { sira: "asc" } } },
  });

  if (!kurs) notFound();

  const erisim = await egitimErisimi(kullanici.id, kurs.id);
  if (!erisim) redirect(`/egitimler/${slug}`);

  const aktifDers =
    kurs.dersler.find((d) => d.id === dersId) ?? kurs.dersler[0] ?? null;

  const gomme = aktifDers?.videoUrl ? gommeAdresi(aktifDers.videoUrl) : null;
  const toplamDk = kurs.dersler.reduce((t, d) => t + d.sureDk, 0);

  return (
    <section className="kapsayici py-10">
      <Link
        href="/panel"
        className="inline-flex items-center gap-2 text-sm text-metin2 hover:text-altin-400"
      >
        <ArrowLeft size={15} /> Panelim
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold">{kurs.baslik}</h1>
          {aktifDers && (
            <p className="mt-1.5 text-sm text-metin2">{aktifDers.baslik}</p>
          )}

          <div className="mt-6 overflow-hidden rounded-2xl border border-gece-700 bg-gece-900">
            {gomme ? (
              <div className="aspect-video">
                <iframe
                  src={gomme}
                  title={aktifDers?.baslik ?? kurs.baslik}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="grid aspect-video place-items-center p-8 text-center">
                <div>
                  <Video size={34} className="mx-auto mb-3 text-metin3" />
                  <p className="text-sm text-metin2">
                    Bu dersin videosu henüz yüklenmemiş.
                  </p>
                  <p className="mt-1 text-xs text-metin3">
                    En kısa sürede eklenecek.
                  </p>
                </div>
              </div>
            )}
          </div>

          {aktifDers?.aciklama && (
            <div className="mt-6 rounded-2xl border border-gece-700 bg-gece-850 p-6">
              <h2 className="mb-2 font-baslik text-base font-bold">Ders notu</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-metin2">
                {aktifDers.aciklama}
              </p>
            </div>
          )}

          {kurs.dersler.length === 0 && (
            <div className="mt-6">
              <Uyari tur="bilgi">
                Bu eğitimin dersleri henüz yüklenmemiş. Yüklendiğinde burada
                görünecek.
              </Uyari>
            </div>
          )}
        </div>

        <aside>
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-gece-700 bg-gece-850">
            <div className="border-b border-gece-700 p-5">
              <h2 className="font-baslik text-base font-bold">Ders içeriği</h2>
              <p className="mt-1 text-xs text-metin3">
                {kurs.dersler.length} ders · {Math.round(toplamDk / 60)} sa{" "}
                {toplamDk % 60} dk
              </p>
            </div>

            <ol className="max-h-[60vh] divide-y divide-gece-700 overflow-y-auto">
              {kurs.dersler.map((d, i) => {
                const aktif = d.id === aktifDers?.id;
                return (
                  <li key={d.id}>
                    <Link
                      href={`/panel/egitimlerim/${slug}?ders=${d.id}`}
                      className={`flex items-center gap-3 p-4 text-sm transition-colors ${
                        aktif ? "bg-altin-500/10" : "hover:bg-gece-800"
                      }`}
                    >
                      <span className="w-5 shrink-0 text-center text-xs text-metin3">
                        {i + 1}
                      </span>
                      {d.videoUrl ? (
                        <PlayCircle
                          size={16}
                          className={`shrink-0 ${aktif ? "text-altin-400" : "text-metin3"}`}
                        />
                      ) : (
                        <Lock size={14} className="shrink-0 text-metin3" />
                      )}
                      <span
                        className={`min-w-0 flex-1 truncate ${
                          aktif ? "font-semibold text-altin-400" : "text-metin2"
                        }`}
                      >
                        {d.baslik}
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-xs text-metin3">
                        <Clock size={11} /> {d.sureDk}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mt-4">
            <ButonLink href="/panel" tur="ikincil" className="w-full">
              Tüm eğitimlerim
            </ButonLink>
          </div>
        </aside>
      </div>
    </section>
  );
}
