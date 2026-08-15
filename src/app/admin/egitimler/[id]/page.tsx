import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { AdminBaslik } from "@/components/admin-ui";
import { Uyari } from "@/components/ui";
import { EgitimFormu } from "../egitim-formu";
import { DersYoneticisi } from "./dersler";

export const metadata = { title: "Eğitimi Düzenle" };

export default async function EgitimDuzenle({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kaydedildi?: string }>;
}) {
  const { id } = await params;
  const { kaydedildi } = await searchParams;

  const egitim = await db.course.findUnique({
    where: { id },
    include: {
      dersler: { orderBy: { sira: "asc" } },
      _count: { select: { kayitlar: true } },
    },
  });

  if (!egitim) notFound();

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/egitimler"
          className="inline-flex items-center gap-2 text-sm text-metin2 hover:text-altin-400"
        >
          <ArrowLeft size={15} /> Eğitimler
        </Link>
        {egitim.yayinda && (
          <Link
            href={`/egitimler/${egitim.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-altin-400 hover:underline"
          >
            Sitede gör <ExternalLink size={13} />
          </Link>
        )}
      </div>

      <AdminBaslik
        baslik={egitim.baslik}
        aciklama={`${egitim.dersler.length} ders · ${egitim._count.kayitlar} kişi satın aldı`}
      />

      {kaydedildi && (
        <div className="mb-6">
          <Uyari tur="basari">Değişiklikler kaydedildi.</Uyari>
        </div>
      )}

      {egitim._count.kayitlar > 0 && (
        <div className="mb-6">
          <Uyari tur="bilgi">
            Bu eğitimi <strong>{egitim._count.kayitlar} kişi</strong> satın aldı.
            Fiyat değişikliği yalnız yeni satışları etkiler; mevcut alıcıların
            erişimi devam eder.
          </Uyari>
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <EgitimFormu egitim={egitim} />
        <DersYoneticisi courseId={egitim.id} dersler={egitim.dersler} />
      </div>
    </>
  );
}
