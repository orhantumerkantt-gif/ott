import crypto from "node:crypto";
import { db } from "@/lib/db";
import { SIPARIS_DURUM, SIPARIS_TUR, ABONELIK_DURUM } from "@/lib/sabitler";
import type { OdemeUrunTuru } from "@/lib/odeme";

/**
 * Sipariş numarası üretir.
 * PayTR merchant_oid YALNIZ harf ve rakam kabul eder — tire, alt çizgi,
 * Türkçe karakter kullanılamaz, aksi halde token isteği reddedilir.
 */
export function siparisNoUret(): string {
  return (
    "DO" +
    Date.now().toString(36).toUpperCase() +
    crypto.randomBytes(4).toString("hex").toUpperCase()
  );
}

export type SatinAlinacak =
  | { tur: "EGITIM"; slug: string }
  | { tur: "YAZILIM"; slug: string }
  | { tur: "ABONELIK" }
  | { tur: "DANISMANLIK"; saat?: number };

/** Ürünün adını ve GÜNCEL fiyatını veritabanından okur. */
export async function urunBilgisi(
  istek: SatinAlinacak,
): Promise<{ ad: string; tutarKurus: number; urunId: string | null } | null> {
  switch (istek.tur) {
    case "EGITIM": {
      const k = await db.course.findUnique({ where: { slug: istek.slug } });
      if (!k || !k.yayinda) return null;
      return { ad: `Eğitim: ${k.baslik}`, tutarKurus: k.fiyatKurus, urunId: k.id };
    }
    case "YAZILIM": {
      const y = await db.software.findUnique({ where: { slug: istek.slug } });
      if (!y || !y.yayinda) return null;
      return { ad: `Yazılım: ${y.ad}`, tutarKurus: y.fiyatKurus, urunId: y.id };
    }
    case "ABONELIK": {
      const p = await db.plan.findUnique({ where: { slug: "aylik" } });
      if (!p || !p.aktif) return null;
      return { ad: p.ad, tutarKurus: p.fiyatKurus, urunId: p.id };
    }
    case "DANISMANLIK": {
      const saat = Math.max(1, Math.min(istek.saat ?? 1, 8));
      const birim = 500_000;
      return {
        ad: `Birebir Danışmanlık (${saat} saat)`,
        tutarKurus: birim * saat,
        urunId: null,
      };
    }
  }
}

/**
 * Ödeme onaylandığında erişimi açar.
 *
 * ★ ÇİFT ÇALIŞMAYA DAYANIKLI olmalı: PayTR aynı bildirimi ağ hatasında
 *   tekrar gönderir. Sipariş zaten ÖDENDİ ise hiçbir şey yapılmaz;
 *   yoksa kullanıcı iki kez abonelik süresi kazanırdı.
 */
export async function erisimAc(merchantOid: string): Promise<{ ilkKez: boolean }> {
  const siparis = await db.order.findUnique({ where: { merchantOid } });
  if (!siparis) throw new Error(`Sipariş bulunamadı: ${merchantOid}`);

  if (siparis.durum === SIPARIS_DURUM.ODENDI) return { ilkKez: false };

  await db.order.update({
    where: { id: siparis.id },
    data: { durum: SIPARIS_DURUM.ODENDI, odendiAt: new Date() },
  });

  if (!siparis.userId) return { ilkKez: true };

  switch (siparis.tur) {
    case SIPARIS_TUR.EGITIM: {
      if (!siparis.urunId) break;
      await db.enrollment.upsert({
        where: { userId_courseId: { userId: siparis.userId, courseId: siparis.urunId } },
        update: {},
        create: {
          userId: siparis.userId,
          courseId: siparis.urunId,
          kaynak: "SATIN_ALMA",
        },
      });
      break;
    }

    case SIPARIS_TUR.ABONELIK: {
      const plan = await db.plan.findUnique({ where: { slug: "aylik" } });
      if (!plan) break;

      const mevcut = await db.subscription.findUnique({
        where: { userId: siparis.userId },
      });

      // Süre EKLENİR, sıfırlanmaz: erken yenileyen kullanıcı kalan
      // günlerini kaybetmesin.
      const simdi = new Date();
      const taban =
        mevcut?.donemSonu && mevcut.donemSonu > simdi ? mevcut.donemSonu : simdi;
      const yeniSon = new Date(taban);
      yeniSon.setMonth(yeniSon.getMonth() + plan.periyotAy);

      await db.subscription.upsert({
        where: { userId: siparis.userId },
        update: {
          planId: plan.id,
          durum: ABONELIK_DURUM.AKTIF,
          donemSonu: yeniSon,
          baslangic: mevcut?.baslangic ?? simdi,
        },
        create: {
          userId: siparis.userId,
          planId: plan.id,
          durum: ABONELIK_DURUM.AKTIF,
          baslangic: simdi,
          donemSonu: yeniSon,
        },
      });
      break;
    }

    case SIPARIS_TUR.DANISMANLIK: {
      const randevu = await db.booking.findUnique({ where: { orderId: siparis.id } });
      if (randevu) {
        await db.booking.update({
          where: { id: randevu.id },
          data: { durum: "ONAYLANDI" },
        });
      }
      break;
    }

    // YAZILIM: ayrı bir kayıt gerekmiyor; indirme yetkisi ödenmiş siparişten
    // doğrudan okunuyor (bkz. /panel/indir/[slug]).
  }

  return { ilkKez: true };
}

/** Kullanıcı bu yazılımı indirebilir mi? Satın alma VEYA aktif abonelik. */
export async function yazilimErisimi(userId: string, softwareId: string) {
  const satinAlma = await db.order.findFirst({
    where: {
      userId,
      tur: SIPARIS_TUR.YAZILIM,
      urunId: softwareId,
      durum: SIPARIS_DURUM.ODENDI,
    },
    select: { id: true },
  });
  if (satinAlma) return true;

  const yazilim = await db.software.findUnique({
    where: { id: softwareId },
    select: { abonelikDahil: true },
  });
  if (!yazilim?.abonelikDahil) return false;

  const abonelik = await db.subscription.findUnique({ where: { userId } });
  return Boolean(
    abonelik &&
      abonelik.durum === ABONELIK_DURUM.AKTIF &&
      abonelik.donemSonu &&
      abonelik.donemSonu.getTime() > Date.now(),
  );
}
