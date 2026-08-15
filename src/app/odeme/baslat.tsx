import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ShieldCheck, ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { oturumZorunlu } from "@/lib/yetki";
import { odemeSaglayici, odemeTestModundaMi } from "@/lib/odeme";
import { siparisNoUret, urunBilgisi, type SatinAlinacak } from "@/lib/siparis";
import { kurusTL } from "@/lib/site";
import { SIPARIS_DURUM } from "@/lib/sabitler";
import { Uyari } from "@/components/ui";
import { OdemeOnay, SOZLESME_SURUM } from "./onay";

/**
 * Tüm ödeme başlangıçlarının ortak gövdesi.
 * Eğitim / yazılım / abonelik / danışmanlık sayfaları buraya delege eder;
 * sipariş oluşturma ve sağlayıcı çağrısı tek yerde kalır.
 */
export async function OdemeBaslat({
  istek,
  geriYol,
  onaylandi = false,
}: {
  istek: SatinAlinacak;
  geriYol: string;
  /** Sözleşme + cayma hakkı kutucukları işaretlenip gönderildi mi? */
  onaylandi?: boolean;
}) {
  const kullanici = await oturumZorunlu(geriYol);

  const urun = await urunBilgisi(istek);
  if (!urun) redirect(geriYol);

  // ★ ONAY KAPISI — sipariş kaydı bile bundan SONRA oluşur.
  //   "Dijital üründe iade yoktur" maddesi, ancak alıcı bunu ödemeden önce
  //   açıkça kabul ettiyse geçerlidir (Mesafeli Sözleşmeler Yön. m.15).
  //   Yan fayda: sayfayı açıp vazgeçen ziyaretçi artık BEKLIYOR durumunda
  //   ölü sipariş bırakmıyor.
  if (!onaylandi) {
    return (
      <OdemeOnay
        urunAdi={urun.ad}
        tutarKurus={urun.tutarKurus}
        tur={istek.tur}
        geriYol={geriYol}
      />
    );
  }

  // Fiyat, formdan DEĞİL veritabanından okunur. Aksi halde istemci
  // gönderdiği tutarı değiştirip 1 TL'ye satın alabilirdi.
  const merchantOid = siparisNoUret();

  const kullaniciBilgi = await db.user.findUnique({
    where: { id: kullanici.id },
    select: { adSoyad: true, email: true, telefon: true },
  });

  await db.order.create({
    data: {
      merchantOid,
      userId: kullanici.id,
      tur: istek.tur,
      urunId: urun.urunId,
      urunAdi: urun.ad,
      tutarKurus: urun.tutarKurus,
      durum: SIPARIS_DURUM.BEKLIYOR,
      adSoyad: kullaniciBilgi?.adSoyad ?? kullanici.name ?? "-",
      email: kullaniciBilgi?.email ?? kullanici.email ?? "-",
      telefon: kullaniciBilgi?.telefon ?? "-",
      sozlesmeOnayAt: new Date(),
      sozlesmeSurum: SOZLESME_SURUM,
    },
  });

  const basliklar = await headers();
  const ip =
    basliklar.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    basliklar.get("x-real-ip") ||
    "127.0.0.1";

  const saglayici = odemeSaglayici();

  let sonuc;
  try {
    sonuc = await saglayici.odemeBaslat({
      merchantOid,
      tutarKurus: urun.tutarKurus,
      urunAdi: urun.ad,
      tur: istek.tur,
      adSoyad: kullaniciBilgi?.adSoyad ?? "-",
      email: kullaniciBilgi?.email ?? "-",
      telefon: kullaniciBilgi?.telefon ?? "-",
      adres: "-",
      kullaniciIp: ip,
      tekrarlayan: istek.tur === "ABONELIK",
    });
  } catch (e) {
    await db.order.update({
      where: { merchantOid },
      data: {
        durum: SIPARIS_DURUM.BASARISIZ,
        hataMesaji: e instanceof Error ? e.message : "Bilinmeyen hata",
      },
    });

    return (
      <section className="kapsayici max-w-lg py-20">
        <Uyari tur="hata">
          <strong>Ödeme başlatılamadı.</strong>
          <br />
          {e instanceof Error ? e.message : "Bilinmeyen bir hata oluştu."}
        </Uyari>
        <div className="mt-6 text-center">
          <Link href={geriYol} className="text-sm text-altin-400 hover:underline">
            ← Geri dön
          </Link>
        </div>
      </section>
    );
  }

  if (sonuc.yontem === "yonlendirme") redirect(sonuc.adres);

  return (
    <section className="kapsayici max-w-3xl py-10">
      <Link
        href={geriYol}
        className="inline-flex items-center gap-2 text-sm text-metin2 hover:text-altin-400"
      >
        <ArrowLeft size={15} /> Vazgeç
      </Link>

      <div className="mt-6 rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gece-700 pb-5">
          <div>
            <h1 className="font-baslik text-lg font-bold">{urun.ad}</h1>
            <p className="mt-1 text-xs text-metin3">Sipariş no: {merchantOid}</p>
          </div>
          <b className="font-baslik text-2xl font-extrabold">
            {kurusTL(urun.tutarKurus)}
          </b>
        </div>

        {odemeTestModundaMi() && (
          <div className="mb-5">
            <Uyari tur="bilgi">
              <AlertTriangle size={14} className="mr-1 inline" />
              <strong>Test modu açık.</strong> Gerçek tahsilat yapılmaz.
            </Uyari>
          </div>
        )}

        <iframe
          src={sonuc.adres}
          title="Güvenli ödeme ekranı"
          className="h-[620px] w-full rounded-xl border border-gece-700 bg-white"
          allow="payment"
        />

        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-metin3">
          <ShieldCheck size={14} className="text-basari" />
          Kart bilgilerin bu siteye ulaşmaz; doğrudan PayTR ve bankan arasında işlenir.
        </p>
      </div>
    </section>
  );
}
