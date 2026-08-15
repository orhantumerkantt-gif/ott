import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { db } from "@/lib/db";
import { kurusTL, site } from "@/lib/site";
import { taklitImza } from "@/lib/odeme/taklit";
import { Buton, Uyari } from "@/components/ui";
import { SIPARIS_DURUM } from "@/lib/sabitler";

export const metadata: Metadata = {
  title: "Test Ödeme Ekranı",
  robots: { index: false, follow: false },
};

/**
 * PayTR anahtarları tanımlanana kadar kullanılan simülasyon ekranı.
 *
 * Gerçek ödeme ekranının yerine geçer ama BİLDİRİM YOLUNU aynen kullanır:
 * "Başarılı" seçilince /api/odeme/bildirim ucuna imzalı bir istek gider.
 * Böylece canlıya geçtiğimizde test edilmemiş bir kod yolu kalmaz.
 */
export default async function TaklitOdemeSayfasi({
  params,
}: {
  params: Promise<{ oid: string }>;
}) {
  // Üretimde bu sayfa ASLA açılmamalı — bedava erişim kapısı olurdu.
  if (process.env.NODE_ENV === "production" && process.env.PAYTR_MERCHANT_ID) {
    notFound();
  }

  const { oid } = await params;
  const siparis = await db.order.findUnique({ where: { merchantOid: oid } });
  if (!siparis) notFound();

  async function bildirimGonder(basarili: boolean) {
    "use server";
    const durum = basarili ? "success" : "failed";

    const govde = new URLSearchParams({
      merchant_oid: oid,
      status: durum,
      total_amount: String(siparis!.tutarKurus),
      hash: taklitImza(oid, durum),
    });

    // Kendi bildirim ucumuza, gerçek sağlayıcının yaptığı gibi POST atıyoruz.
    await fetch(`${site.url}/api/odeme/bildirim`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: govde,
      cache: "no-store",
    });

    redirect(basarili ? "/odeme/basarili" : "/odeme/basarisiz");
  }

  const zatenOdendi = siparis.durum === SIPARIS_DURUM.ODENDI;

  return (
    <section className="kapsayici max-w-lg py-16">
      <Uyari tur="bilgi">
        <AlertTriangle size={14} className="mr-1 inline" />
        <strong>Test ödeme ekranı.</strong> PayTR anahtarları henüz tanımlı değil.
        Burada gerçek para hareketi olmaz; ödeme akışını denemek için kullanılır.
      </Uyari>

      <div className="mt-6 rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <h1 className="font-baslik text-lg font-bold">Ödeme özeti</h1>

        <dl className="mt-5 grid gap-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-gece-700 pb-3">
            <dt className="text-metin2">Ürün</dt>
            <dd className="text-right font-medium">{siparis.urunAdi}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-gece-700 pb-3">
            <dt className="text-metin2">Sipariş no</dt>
            <dd className="text-right font-mono text-xs">{siparis.merchantOid}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-metin2">Tutar</dt>
            <dd className="font-baslik text-xl font-extrabold">
              {kurusTL(siparis.tutarKurus)}
            </dd>
          </div>
        </dl>

        {zatenOdendi ? (
          <div className="mt-6">
            <Uyari tur="basari">Bu sipariş zaten ödenmiş.</Uyari>
          </div>
        ) : (
          <div className="mt-7 grid gap-3">
            <form action={bildirimGonder.bind(null, true)}>
              <Buton type="submit" className="w-full">
                ✓ Ödemeyi Başarılı Say
              </Buton>
            </form>
            <form action={bildirimGonder.bind(null, false)}>
              <Buton type="submit" tur="ikincil" className="w-full">
                ✕ Ödemeyi Reddet (hata senaryosu)
              </Buton>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
