import crypto from "node:crypto";
import { site } from "@/lib/site";
import type {
  BildirimSonucu,
  OdemeBaslatSonucu,
  OdemeSaglayici,
  OdemeSiparisi,
} from "./tur";

/**
 * PayTR iFrame API entegrasyonu.
 * Belgeler: https://dev.paytr.com/iframe-api
 *
 * Akış:
 *  1) Sunucudan PayTR'ye token isteği gönderilir (imzalı).
 *  2) Dönen token ile ödeme ekranı iframe içinde açılır.
 *  3) Ödeme sonucu PayTR tarafından "Bildirim URL"ine POST edilir.
 *  4) Bildirim imzası doğrulanır; sunucu "OK" yanıtı döndürmek ZORUNDADIR,
 *     aksi halde PayTR aynı bildirimi tekrar tekrar gönderir.
 */

const TOKEN_ADRESI = "https://www.paytr.com/odeme/api/get-token";
const IFRAME_ADRESI = "https://www.paytr.com/odeme/guvenli";

function ayarlar() {
  const id = process.env.PAYTR_MERCHANT_ID ?? "";
  const key = process.env.PAYTR_MERCHANT_KEY ?? "";
  const salt = process.env.PAYTR_MERCHANT_SALT ?? "";
  return { id, key, salt, tamam: Boolean(id && key && salt) };
}

/** PayTR sepet biçimi: [[ad, fiyat, adet], ...] -> base64 */
function sepetOlustur(urunAdi: string, tutarKurus: number): string {
  const sepet = [[urunAdi, (tutarKurus / 100).toFixed(2), 1]];
  return Buffer.from(JSON.stringify(sepet)).toString("base64");
}

function hmac(veri: string, key: string): string {
  return crypto.createHmac("sha256", key).update(veri).digest("base64");
}

export const paytr: OdemeSaglayici = {
  ad: "PayTR",

  get canliMi() {
    return ayarlar().tamam;
  },

  async odemeBaslat(siparis: OdemeSiparisi): Promise<OdemeBaslatSonucu> {
    const { id, key, salt, tamam } = ayarlar();
    if (!tamam) {
      throw new Error("PayTR anahtarları tanımlı değil.");
    }

    const testMod = process.env.PAYTR_TEST_MODE === "1" ? "1" : "0";
    const sepet = sepetOlustur(siparis.urunAdi, siparis.tutarKurus);
    const odemeTutari = String(siparis.tutarKurus); // PayTR kuruş bekler
    const noInstallment = "0";
    const maxInstallment = "0";
    const currency = "TL";

    // İmza sırası PayTR belgesinde SABİTTİR; sıra değişirse imza tutmaz.
    const hashStr =
      id +
      siparis.kullaniciIp +
      siparis.merchantOid +
      siparis.email +
      odemeTutari +
      sepet +
      noInstallment +
      maxInstallment +
      currency +
      testMod;

    const paytrToken = hmac(hashStr + salt, key);

    const govde = new URLSearchParams({
      merchant_id: id,
      user_ip: siparis.kullaniciIp,
      merchant_oid: siparis.merchantOid,
      email: siparis.email,
      payment_amount: odemeTutari,
      paytr_token: paytrToken,
      user_basket: sepet,
      debug_on: process.env.NODE_ENV === "production" ? "0" : "1",
      no_installment: noInstallment,
      max_installment: maxInstallment,
      user_name: siparis.adSoyad,
      user_address: siparis.adres || "-",
      user_phone: siparis.telefon || "-",
      merchant_ok_url: `${site.url}/odeme/basarili`,
      merchant_fail_url: `${site.url}/odeme/basarisiz`,
      timeout_limit: "30",
      currency,
      test_mode: testMod,
      lang: "tr",
    });

    const yanit = await fetch(TOKEN_ADRESI, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: govde,
      cache: "no-store",
    });

    const sonuc = (await yanit.json()) as { status: string; token?: string; reason?: string };

    if (sonuc.status !== "success" || !sonuc.token) {
      throw new Error(`PayTR token alınamadı: ${sonuc.reason ?? "bilinmeyen hata"}`);
    }

    return { yontem: "iframe", adres: `${IFRAME_ADRESI}/${sonuc.token}` };
  },

  async bildirimDogrula(govde: Record<string, string>): Promise<BildirimSonucu> {
    const { key, salt, tamam } = ayarlar();
    const merchantOid = govde.merchant_oid ?? "";

    if (!tamam) {
      return {
        gecerli: false,
        merchantOid,
        basarili: false,
        hataMesaji: "PayTR anahtarları tanımlı değil.",
        cevap: "PAYTR_YAPILANDIRILMAMIS",
      };
    }

    // Bildirim imzası: merchant_oid + salt + status + total_amount
    const beklenen = hmac(merchantOid + salt + govde.status + govde.total_amount, key);

    if (beklenen !== govde.hash) {
      // İmza tutmuyorsa bu istek PayTR'den GELMEMİŞTİR. "OK" dönmüyoruz.
      return {
        gecerli: false,
        merchantOid,
        basarili: false,
        hataMesaji: "Bildirim imzası doğrulanamadı.",
        cevap: "PAYTR notification failed: bad hash",
      };
    }

    return {
      gecerli: true,
      merchantOid,
      basarili: govde.status === "success",
      hataMesaji: govde.status === "success" ? undefined : govde.failed_reason_msg,
      cevap: "OK",
    };
  },
};
