import { db } from "@/lib/db";
import { kurusTL } from "@/lib/site";
import { SIPARIS_DURUM } from "@/lib/sabitler";
import {
  AdminBaslik,
  Tablo,
  DurumRozeti,
  IstatistikKarti,
  tarihSaatBicimi,
} from "@/components/admin-ui";

export const metadata = { title: "Siparişler" };

const SAYFA_BOYUTU = 50;

export default async function AdminSiparisler({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string; sayfa?: string }>;
}) {
  const { durum, sayfa } = await searchParams;
  const sayfaNo = Math.max(1, Number(sayfa) || 1);

  const filtre = durum && durum in SIPARIS_DURUM ? { durum } : {};

  const [siparisler, toplam, odenenToplam, bekleyenSayisi] = await Promise.all([
    db.order.findMany({
      where: filtre,
      orderBy: { createdAt: "desc" },
      skip: (sayfaNo - 1) * SAYFA_BOYUTU,
      take: SAYFA_BOYUTU,
    }),
    db.order.count({ where: filtre }),
    db.order.aggregate({
      where: { durum: SIPARIS_DURUM.ODENDI },
      _sum: { tutarKurus: true },
      _count: true,
    }),
    db.order.count({ where: { durum: SIPARIS_DURUM.BEKLIYOR } }),
  ]);

  const sonSayfa = Math.max(1, Math.ceil(toplam / SAYFA_BOYUTU));

  return (
    <>
      <AdminBaslik
        baslik="Siparişler"
        aciklama="Tüm ödeme kayıtları. Erişim yalnız bankadan onay geldiğinde açılır."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <IstatistikKarti
          etiket="Toplam tahsilat"
          deger={kurusTL(odenenToplam._sum.tutarKurus ?? 0)}
          alt={`${odenenToplam._count} ödenmiş sipariş`}
          vurgu
        />
        <IstatistikKarti etiket="Ödeme bekleyen" deger={String(bekleyenSayisi)} />
        <IstatistikKarti etiket="Toplam kayıt" deger={String(toplam)} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Suzgec aktif={!durum} href="/admin/siparisler" ad="Tümü" />
        <Suzgec aktif={durum === "ODENDI"} href="?durum=ODENDI" ad="Ödendi" />
        <Suzgec aktif={durum === "BEKLIYOR"} href="?durum=BEKLIYOR" ad="Bekliyor" />
        <Suzgec aktif={durum === "BASARISIZ"} href="?durum=BASARISIZ" ad="Başarısız" />
      </div>

      <Tablo
        basliklar={["Tarih", "Sipariş No", "Müşteri", "Ürün", "Tutar", "Durum"]}
        bosMu={siparisler.length === 0}
        bosMesaj="Bu filtrede sipariş yok."
      >
        {siparisler.map((s) => (
          <tr key={s.id}>
            <td className="whitespace-nowrap px-4 py-3 text-metin3">
              {tarihSaatBicimi.format(s.createdAt)}
            </td>
            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-metin3">
              {s.merchantOid}
            </td>
            <td className="px-4 py-3">
              <div className="font-medium">{s.adSoyad}</div>
              <div className="text-xs text-metin3">{s.email}</div>
            </td>
            <td className="px-4 py-3 text-metin2">{s.urunAdi}</td>
            <td className="whitespace-nowrap px-4 py-3 font-semibold">
              {kurusTL(s.tutarKurus)}
            </td>
            <td className="px-4 py-3">
              <DurumRozeti durum={s.durum} />
              {s.hataMesaji && (
                <div className="mt-1 max-w-[220px] truncate text-xs text-hata" title={s.hataMesaji}>
                  {s.hataMesaji}
                </div>
              )}
            </td>
          </tr>
        ))}
      </Tablo>

      {sonSayfa > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3 text-sm">
          {sayfaNo > 1 && (
            <a
              href={`?${durum ? `durum=${durum}&` : ""}sayfa=${sayfaNo - 1}`}
              className="rounded-lg border border-gece-600 px-4 py-2 hover:border-altin-500"
            >
              ← Önceki
            </a>
          )}
          <span className="text-metin3">
            Sayfa {sayfaNo} / {sonSayfa}
          </span>
          {sayfaNo < sonSayfa && (
            <a
              href={`?${durum ? `durum=${durum}&` : ""}sayfa=${sayfaNo + 1}`}
              className="rounded-lg border border-gece-600 px-4 py-2 hover:border-altin-500"
            >
              Sonraki →
            </a>
          )}
        </div>
      )}
    </>
  );
}

function Suzgec({ aktif, href, ad }: { aktif: boolean; href: string; ad: string }) {
  return (
    <a
      href={href}
      className={`rounded-lg border px-3.5 py-2 text-sm transition-colors ${
        aktif
          ? "border-altin-500 bg-altin-500/10 text-altin-400"
          : "border-gece-600 text-metin2 hover:border-gece-500"
      }`}
    >
      {ad}
    </a>
  );
}
