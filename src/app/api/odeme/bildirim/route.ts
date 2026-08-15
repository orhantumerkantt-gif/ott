import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { odemeSaglayici } from "@/lib/odeme";
import { erisimAc } from "@/lib/siparis";
import { SIPARIS_DURUM } from "@/lib/sabitler";

/**
 * Ödeme sağlayıcısının bildirim (callback) adresi.
 * PayTR panelinde "Bildirim URL" olarak şu adres tanımlanmalı:
 *     https://www.dedektiforhan.com/api/odeme/bildirim
 *
 * ★★ EN KRİTİK NOKTA: Erişim YALNIZ bu uçtan açılır.
 *    Kullanıcının "başarılı" sayfasına dönmesi ödeme yapıldığı anlamına
 *    GELMEZ — o adres tarayıcıya elle de yazılabilir. Gerçek onay,
 *    imzası doğrulanmış bu sunucu-sunucu bildirimidir.
 *
 * ★ PayTR gövdeye "OK" yanıtı bekler. Başka bir şey dönersek bildirimi
 *   saatlerce tekrar gönderir.
 */
export async function POST(istek: Request) {
  let govde: Record<string, string>;

  try {
    const form = await istek.formData();
    govde = Object.fromEntries(
      Array.from(form.entries()).map(([k, v]) => [k, String(v)]),
    );
  } catch {
    return new NextResponse("BAD_REQUEST", { status: 400 });
  }

  const saglayici = odemeSaglayici();
  const sonuc = await saglayici.bildirimDogrula(govde);

  if (!sonuc.gecerli) {
    console.error("[ödeme] Geçersiz bildirim:", sonuc.hataMesaji, govde.merchant_oid);
    // 200 dönmüyoruz: doğrulanmamış isteği "işlendi" saymak,
    // saldırgana sessiz başarı hissi verir.
    return new NextResponse(sonuc.cevap, { status: 400 });
  }

  const siparis = await db.order.findUnique({
    where: { merchantOid: sonuc.merchantOid },
  });

  if (!siparis) {
    console.error("[ödeme] Bilinmeyen sipariş:", sonuc.merchantOid);
    // Bilinmeyen sipariş için OK dönüyoruz; aksi halde sağlayıcı
    // asla var olmayan bir siparişi sonsuza kadar tekrar dener.
    return new NextResponse("OK", { status: 200 });
  }

  // Ham bildirimi denetim izi olarak sakla (uyuşmazlıkta tek kanıt).
  await db.order.update({
    where: { id: siparis.id },
    data: { paytrYanit: JSON.stringify(govde) },
  });

  if (sonuc.basarili) {
    try {
      const { ilkKez } = await erisimAc(sonuc.merchantOid);
      console.log(
        `[ödeme] ${sonuc.merchantOid} onaylandı` + (ilkKez ? "" : " (tekrar bildirim, atlandı)"),
      );
    } catch (e) {
      console.error("[ödeme] Erişim açılamadı:", e);
      // OK DÖNMÜYORUZ: sağlayıcı tekrar denesin, ödeme kaybolmasın.
      return new NextResponse("ERROR", { status: 500 });
    }
  } else {
    await db.order.update({
      where: { id: siparis.id },
      data: {
        durum: SIPARIS_DURUM.BASARISIZ,
        hataMesaji: sonuc.hataMesaji ?? "Ödeme başarısız",
      },
    });
  }

  return new NextResponse(sonuc.cevap, { status: 200 });
}

/** Tarayıcıdan açılırsa bilgilendirici cevap ver (hata sayfası yerine). */
export async function GET() {
  return new NextResponse(
    "Bu adres ödeme sağlayıcısının bildirim ucudur. Tarayıcıdan kullanılmaz.",
    { status: 405 },
  );
}
