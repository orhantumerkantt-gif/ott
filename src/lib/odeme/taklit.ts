import crypto from "node:crypto";
import type {
  BildirimSonucu,
  OdemeBaslatSonucu,
  OdemeSaglayici,
  OdemeSiparisi,
} from "./tur";

/**
 * Taklit (test) ödeme sağlayıcısı.
 *
 * PayTR anahtarları tanımlı DEĞİLKEN devreye girer. Gerçek para hareketi
 * olmadan tüm akışın denenmesini sağlar: sipariş oluşur, kullanıcı bir
 * simülasyon ekranına gider, "başarılı/başarısız" seçer, bildirim aynı
 * yoldan işlenir ve erişim açılır.
 *
 * ★ Bu sağlayıcı ÜRETİMDE ASLA ÇALIŞMAMALI. `index.ts` içinde
 *   NODE_ENV=production + anahtar yok durumunda hata fırlatılır.
 */
export const taklit: OdemeSaglayici = {
  ad: "Taklit (test)",
  canliMi: false,

  async odemeBaslat(siparis: OdemeSiparisi): Promise<OdemeBaslatSonucu> {
    return {
      yontem: "yonlendirme",
      adres: `/odeme/taklit/${encodeURIComponent(siparis.merchantOid)}`,
    };
  },

  async bildirimDogrula(govde: Record<string, string>): Promise<BildirimSonucu> {
    const merchantOid = govde.merchant_oid ?? "";
    // Taklit modda da imza kontrolü YAPILIR; böylece bildirim işleyicisinin
    // doğrulama yolu gerçek moddakiyle aynı kod üzerinden geçer ve
    // "canlıda çalışmayan" bir yol test edilmemiş kalmaz.
    const beklenen = crypto
      .createHmac("sha256", "taklit-anahtar")
      .update(merchantOid + govde.status)
      .digest("hex");

    if (govde.hash !== beklenen) {
      return {
        gecerli: false,
        merchantOid,
        basarili: false,
        hataMesaji: "Taklit imza doğrulanamadı.",
        cevap: "BAD_HASH",
      };
    }

    return {
      gecerli: true,
      merchantOid,
      basarili: govde.status === "success",
      hataMesaji: govde.status === "success" ? undefined : "Test: ödeme reddedildi",
      cevap: "OK",
    };
  },
};

/** Taklit bildirim imzası — simülasyon sayfası bunu kullanır. */
export function taklitImza(merchantOid: string, status: string) {
  return crypto
    .createHmac("sha256", "taklit-anahtar")
    .update(merchantOid + status)
    .digest("hex");
}
