import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { AdminBaslik } from "@/components/admin-ui";
import { Uyari } from "@/components/ui";
import { YazilimFormu } from "../yazilim-formu";

export const metadata = { title: "Yazılımı Düzenle" };

export default async function YazilimDuzenle({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kaydedildi?: string }>;
}) {
  const { id } = await params;
  const { kaydedildi } = await searchParams;

  const yazilim = await db.software.findUnique({ where: { id } });
  if (!yazilim) notFound();

  return (
    <>
      <Link
        href="/admin/yazilimlar"
        className="mb-5 inline-flex items-center gap-2 text-sm text-metin2 hover:text-altin-400"
      >
        <ArrowLeft size={15} /> Yazılımlar
      </Link>

      <AdminBaslik baslik={yazilim.ad} aciklama={`Sürüm ${yazilim.surum}`} />

      {kaydedildi && (
        <div className="mb-6 max-w-3xl">
          <Uyari tur="basari">Değişiklikler kaydedildi.</Uyari>
        </div>
      )}

      {!yazilim.indirmeUrl && (
        <div className="mb-6 max-w-3xl">
          <Uyari tur="bilgi">
            Bu yazılımın <strong>indirme bağlantısı yok</strong>. Satın alan üyeler
            dosyayı indiremez. Aşağıdaki alana dosya adresini yaz.
          </Uyari>
        </div>
      )}

      <YazilimFormu yazilim={yazilim} />
    </>
  );
}
