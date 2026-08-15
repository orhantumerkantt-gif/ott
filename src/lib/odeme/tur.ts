/**
 * Ödeme sağlayıcı sözleşmesi.
 *
 * Site, PayTR'nin varlığını BİLMEZ — yalnız bu arayüzü çağırır.
 * Yarın iyzico/Stripe/havale eklemek gerekirse tek bir dosya yazılır ve
 * `index.ts`'e kaydedilir; sayfalar, sipariş mantığı ve panel hiç değişmez.
 *
 * (docs/01-mimari.md § "Açık uç #1")
 */

export type OdemeUrunTuru = "EGITIM" | "YAZILIM" | "ABONELIK" | "DANISMANLIK";

export interface OdemeSiparisi {
  merchantOid: string;
  tutarKurus: number;
  urunAdi: string;
  tur: OdemeUrunTuru;
  adSoyad: string;
  email: string;
  telefon: string;
  adres: string;
  kullaniciIp: string;
  /** Abonelik gibi tekrarlayan ödemelerde true. */
  tekrarlayan?: boolean;
}

export interface OdemeBaslatSonucu {
  /** "iframe": adres bir iframe içinde açılır. "yonlendirme": tam sayfa gidilir. */
  yontem: "iframe" | "yonlendirme";
  adres: string;
}

export interface BildirimSonucu {
  gecerli: boolean;
  merchantOid: string;
  basarili: boolean;
  hataMesaji?: string;
  /** Sağlayıcıya döndürülecek cevap gövdesi (PayTR "OK" bekler). */
  cevap: string;
}

export interface OdemeSaglayici {
  readonly ad: string;
  /** Anahtarlar tanımlı değilse false; site bunu görünce taklit moda düşer. */
  readonly canliMi: boolean;

  odemeBaslat(siparis: OdemeSiparisi): Promise<OdemeBaslatSonucu>;

  /**
   * Sağlayıcıdan gelen ödeme bildirimini DOĞRULAR.
   * İmza doğrulaması burada yapılır — doğrulanmamış bildirime asla güvenilmez,
   * aksi halde herkes "ödeme başarılı" isteği gönderip bedava erişim alabilir.
   */
  bildirimDogrula(govde: Record<string, string>): Promise<BildirimSonucu>;
}
