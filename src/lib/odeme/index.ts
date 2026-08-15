import { paytr } from "./paytr";
import { taklit } from "./taklit";
import type { OdemeSaglayici } from "./tur";

export type { OdemeSaglayici, OdemeSiparisi, OdemeUrunTuru } from "./tur";

/**
 * Aktif ödeme sağlayıcısını döndürür.
 *
 * Yeni bir sağlayıcı eklemek: dosyasını yaz, buraya bir satır ekle. Başka
 * hiçbir yer değişmez (docs/01-mimari.md § "Açık uç #1").
 */
export function odemeSaglayici(): OdemeSaglayici {
  // ★★ Yerel geliştirmede PayTR KULLANILMAZ — anahtarlar tanımlı olsa bile.
  //
  // PayTR ödeme sonucunu "Bildirim URL"ine POST eder ve erişimi açan tek şey
  // o bildirimdir. Site adresi localhost ise PayTR oraya ULAŞAMAZ: ödeme
  // ekranı açılır, kart çekilir, ama bildirim hiç gelmediği için abonelik
  // açılmaz ve işlem PayTR tarafında "askıda" kalır.
  //
  // (Orhan'ın mağazasında hâlihazırda bu sebeple askıda kalmış işlemler var.)
  const siteAdresi = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const yerelAdres = /localhost|127\.0\.0\.1|\.local/.test(siteAdresi);

  if (paytr.canliMi && !yerelAdres) return paytr;

  // ★ Güvenlik kapısı: üretimde anahtarsız çalışmak, herkesin bedava
  //   "ödeme" yapıp erişim kazanması demektir. Sessizce taklit moda
  //   düşmek yerine açıkça patlıyoruz.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "PayTR anahtarları tanımlı değil. Üretimde taklit ödeme sağlayıcısı kullanılamaz. " +
        "PAYTR_MERCHANT_ID / PAYTR_MERCHANT_KEY / PAYTR_MERCHANT_SALT değerlerini .env dosyasına ekle.",
    );
  }

  return taklit;
}

/** Arayüzde "test modundasın" uyarısı göstermek için. */
export function odemeTestModundaMi(): boolean {
  return !paytr.canliMi || process.env.PAYTR_TEST_MODE === "1";
}
