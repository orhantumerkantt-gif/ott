import Link from "next/link";
import { Plus, Eye, EyeOff, Star } from "lucide-react";
import { db } from "@/lib/db";
import { kurusTL } from "@/lib/site";
import { SEVIYE_ETIKET } from "@/lib/sabitler";
import { AdminBaslik, Tablo } from "@/components/admin-ui";
import { ButonLink } from "@/components/ui";

export const metadata = { title: "Eğitimler" };

export default async function AdminEgitimler() {
  const egitimler = await db.course.findMany({
    orderBy: [{ sira: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { dersler: true, kayitlar: true } } },
  });

  return (
    <>
      <AdminBaslik
        baslik="Eğitimler"
        aciklama="Eğitim setlerini ekle, düzenle, fiyatlandır ve yayınla."
        eylem={
          <ButonLink href="/admin/egitimler/yeni">
            <Plus size={16} /> Yeni Eğitim
          </ButonLink>
        }
      />

      <Tablo
        basliklar={["Eğitim", "Seviye", "Ders", "Satış", "Fiyat", "Durum", ""]}
        bosMu={egitimler.length === 0}
        bosMesaj="Henüz eğitim yok. Sağ üstten ilk eğitimini ekleyebilirsin."
      >
        {egitimler.map((e) => (
          <tr key={e.id}>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2 font-medium">
                {e.oneCikan && <Star size={13} className="shrink-0 text-altin-400" />}
                {e.baslik}
              </div>
              <div className="mt-0.5 text-xs text-metin3">/{e.slug}</div>
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-metin2">
              {SEVIYE_ETIKET[e.seviye] ?? e.seviye}
            </td>
            <td className="px-4 py-3 text-metin2">{e._count.dersler}</td>
            <td className="px-4 py-3 text-metin2">{e._count.kayitlar}</td>
            <td className="whitespace-nowrap px-4 py-3 font-semibold">
              {kurusTL(e.fiyatKurus)}
            </td>
            <td className="px-4 py-3">
              {e.yayinda ? (
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-basari/15 px-2.5 py-1 text-[11px] font-semibold text-basari">
                  <Eye size={11} /> Yayında
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gece-700 px-2.5 py-1 text-[11px] font-semibold text-metin3">
                  <EyeOff size={11} /> Taslak
                </span>
              )}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-right">
              <Link
                href={`/admin/egitimler/${e.id}`}
                className="text-sm font-semibold text-altin-400 hover:underline"
              >
                Düzenle
              </Link>
            </td>
          </tr>
        ))}
      </Tablo>
    </>
  );
}
