import Link from "next/link";
import { Plus, Eye, EyeOff } from "lucide-react";
import { db } from "@/lib/db";
import { kurusTL } from "@/lib/site";
import { AdminBaslik, Tablo } from "@/components/admin-ui";
import { ButonLink } from "@/components/ui";

export const metadata = { title: "Yazılımlar" };

export default async function AdminYazilimlar() {
  const yazilimlar = await db.software.findMany({
    orderBy: [{ sira: "asc" }, { createdAt: "desc" }],
  });

  const satislar = await db.order.groupBy({
    by: ["urunId"],
    where: { tur: "YAZILIM", durum: "ODENDI" },
    _count: true,
  });
  const satisHarita = new Map(satislar.map((s) => [s.urunId, s._count]));

  return (
    <>
      <AdminBaslik
        baslik="Yazılımlar"
        aciklama="Sattığın programları ekle, sürüm ve indirme bağlantısını yönet."
        eylem={
          <ButonLink href="/admin/yazilimlar/yeni">
            <Plus size={16} /> Yeni Yazılım
          </ButonLink>
        }
      />

      <Tablo
        basliklar={["Yazılım", "Sürüm", "Satış", "Fiyat", "İndirme", "Durum", ""]}
        bosMu={yazilimlar.length === 0}
        bosMesaj="Henüz yazılım yok."
      >
        {yazilimlar.map((y) => (
          <tr key={y.id}>
            <td className="px-4 py-3">
              <div className="font-medium">{y.ad}</div>
              <div className="mt-0.5 max-w-[280px] truncate text-xs text-metin3">
                {y.kisaAciklama}
              </div>
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-metin2">{y.surum}</td>
            <td className="px-4 py-3 text-metin2">{satisHarita.get(y.id) ?? 0}</td>
            <td className="whitespace-nowrap px-4 py-3 font-semibold">
              {kurusTL(y.fiyatKurus)}
            </td>
            <td className="px-4 py-3">
              {y.indirmeUrl ? (
                <span className="text-xs text-basari">Bağlı</span>
              ) : (
                <span className="text-xs text-uyari">Eksik</span>
              )}
            </td>
            <td className="px-4 py-3">
              {y.yayinda ? (
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
                href={`/admin/yazilimlar/${y.id}`}
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
