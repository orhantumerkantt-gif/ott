/**
 * Sitenin tek gerçek kaynağı.
 * Marka metinleri, fiyatlar, iletişim bilgileri ve sosyal hesaplar BURADA durur.
 * Bir metni değiştirmek istersen sayfaları değil, bu dosyayı düzenle.
 */

export const site = {
  ad: "Dedektif Orhan",
  tamAd: "Orhan Tümerkan",
  unvan: "Yapay Zekâ Destekli Sosyal Medya Eğitmeni",
  domain: "dedektiforhan.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dedektiforhan.com",

  slogan: "Sosyal medyada para kazanmanın izini sürüyoruz.",
  kisaAciklama:
    "YouTube, TikTok, Instagram ve Facebook'ta yapay zekâ destekli içerik üretimi, " +
    "kanal büyütme ve gelir modelleri üzerine birebir danışmanlık, eğitim setleri ve yazılımlar.",

  iletisim: {
    email: "orhantumerkantt@gmail.com",
    // TODO: Orhan — yayına almadan önce kendi kurumsal telefon ve adresini yaz.
    telefon: "",
    adres: "",
    calismaSaatleri: "Hafta içi 10:00 - 19:00",
  },

  sosyal: {
    youtube: "https://www.youtube.com/channel/UC9V-GoNVIj1eMcaE3gAZqog",
    instagram: "https://www.instagram.com/orhantumerkan/",
    tiktok: "",
    x: "",
  },

  /**
   * Yasal metinlerde kullanılan satıcı bilgileri.
   * Şahıs şirketinde "ünvan" kişinin kendi adıdır; OTT Medya markadır.
   * ★ Boş bırakılan alanlar yasal metinlerde HİÇ gösterilmez (müşteriye
   *   "— doldurulacak" yazmak, eksik bilgiden daha kötü görünür). Eksik
   *   uyarısı yalnızca yönetici olarak giriş yapıldığında çıkar.
   */
  saticiBilgileri: {
    unvan: "Orhan Tümerkan Tunçay (OTT Medya)",
    sirketTuru: "Şahıs şirketi",
    vergiDairesi: "Söke Vergi Dairesi",
    vergiNo: "",
    mersisNo: "",
    adres: "",
    telefon: "",
    eposta: "orhantumerkantt@gmail.com",
  },

  /**
   * İade politikası. `kesin` = dijital ürünlerde satış sonrası iade yok
   * (Orhan'ın kararı, 15 Ağustos 2026). Bu değerin geçerli olabilmesi için
   * ödeme öncesi açık cayma-hakkı feragati alınır — bkz. odeme/onay.tsx.
   */
  iadePolitikasi: "kesin",

  /** Orhan'ın beyan ettiği ve/veya panel görüntüleriyle desteklenen rakamlar. */
  rakamlar: [
    { deger: "10 Milyar+", etiket: "Toplam izlenme" },
    { deger: "1.000.000+", etiket: "Tek kanalda abone" },
    { deger: "90+", etiket: "YouTube ödül plaketi" }, // 10 altın + 80 gümüş
    { deger: "14 yıl", etiket: "Sahada üretim tecrübesi" },
  ],

  /** İlk YouTube kanalının açıldığı yıl — "kaç yıl tecrübe" hesabı buradan türer. */
  baslangicYili: 2012,
} as const;

/** Fiyatlar kuruş cinsinden tutulur (2.500,00 TL -> 250000). Küsurat hatası olmasın diye. */
export const fiyatlar = {
  abonelikAylikKurus: 250_000, // 2.500 TL / ay
  danismanlikSaatlikKurus: 500_000, // 5.000 TL / saat
} as const;

export function kurusTL(kurus: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: kurus % 100 === 0 ? 0 : 2,
  }).format(kurus / 100);
}

export const menu = [
  { ad: "Ana Sayfa", href: "/" },
  { ad: "Eğitimler", href: "/egitimler" },
  { ad: "Abonelik", href: "/abonelik" },
  { ad: "Danışmanlık", href: "/danismanlik" },
  { ad: "Yazılımlar", href: "/yazilimlar" },
  { ad: "Blog", href: "/blog" },
  { ad: "Hakkımda", href: "/hakkimda" },
  { ad: "İletişim", href: "/iletisim" },
] as const;

export const yasalMenu = [
  { ad: "Mesafeli Satış Sözleşmesi", href: "/yasal/mesafeli-satis-sozlesmesi" },
  { ad: "Ön Bilgilendirme Formu", href: "/yasal/on-bilgilendirme-formu" },
  { ad: "İptal ve İade Politikası", href: "/yasal/iade-politikasi" },
  { ad: "Gizlilik Politikası", href: "/yasal/gizlilik-politikasi" },
  { ad: "KVKK Aydınlatma Metni", href: "/yasal/kvkk-aydinlatma-metni" },
  { ad: "Çerez Politikası", href: "/yasal/cerez-politikasi" },
] as const;
