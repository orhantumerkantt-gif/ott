import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { AdminBaslik } from "@/components/admin-ui";
import { Uyari } from "@/components/ui";
import { YaziFormu } from "../yazi-formu";

export const metadata = { title: "Yazıyı Düzenle" };

export default async function YaziDuzenle({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kaydedildi?: string }>;
}) {
  const { id } = await params;
  const { kaydedildi } = await searchParams;

  const yazi = await db.post.findUnique({ where: { id } });
  if (!yazi) notFound();

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-sm text-metin2 hover:text-altin-400"
        >
          <ArrowLeft size={15} /> Blog
        </Link>
        {yazi.yayinda && (
          <Link
            href={`/blog/${yazi.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-altin-400 hover:underline"
          >
            Sitede gör <ExternalLink size={13} />
          </Link>
        )}
      </div>

      <AdminBaslik baslik={yazi.baslik} aciklama={`${yazi.okumaDk} dakika okuma`} />

      {kaydedildi && (
        <div className="mb-6 max-w-3xl">
          <Uyari tur="basari">Değişiklikler kaydedildi.</Uyari>
        </div>
      )}

      <YaziFormu yazi={yazi} />
    </>
  );
}
