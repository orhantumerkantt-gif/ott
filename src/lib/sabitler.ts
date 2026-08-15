/** SQLite enum desteklemediği için durum değerleri burada merkezî tutulur. */

export const ROL = { UYE: "UYE", ADMIN: "ADMIN" } as const;
export type Rol = (typeof ROL)[keyof typeof ROL];

export const SIPARIS_DURUM = {
  BEKLIYOR: "BEKLIYOR",
  ODENDI: "ODENDI",
  BASARISIZ: "BASARISIZ",
  IADE: "IADE",
} as const;

export const SIPARIS_TUR = {
  EGITIM: "EGITIM",
  YAZILIM: "YAZILIM",
  ABONELIK: "ABONELIK",
  DANISMANLIK: "DANISMANLIK",
} as const;
export type SiparisTur = (typeof SIPARIS_TUR)[keyof typeof SIPARIS_TUR];

export const ABONELIK_DURUM = {
  BEKLIYOR: "BEKLIYOR",
  AKTIF: "AKTIF",
  IPTAL: "IPTAL",
  SURESI_DOLDU: "SURESI_DOLDU",
} as const;

export const RANDEVU_DURUM = {
  TALEP: "TALEP",
  ONAYLANDI: "ONAYLANDI",
  TAMAMLANDI: "TAMAMLANDI",
  IPTAL: "IPTAL",
} as const;

export const SEVIYE = {
  BASLANGIC: "BASLANGIC",
  ORTA: "ORTA",
  ILERI: "ILERI",
} as const;

export const SEVIYE_ETIKET: Record<string, string> = {
  BASLANGIC: "Başlangıç",
  ORTA: "Orta",
  ILERI: "İleri",
};

export const SIPARIS_DURUM_ETIKET: Record<string, string> = {
  BEKLIYOR: "Ödeme bekliyor",
  ODENDI: "Ödendi",
  BASARISIZ: "Başarısız",
  IADE: "İade edildi",
};

export const ABONELIK_DURUM_ETIKET: Record<string, string> = {
  BEKLIYOR: "Ödeme bekliyor",
  AKTIF: "Aktif",
  IPTAL: "İptal edildi",
  SURESI_DOLDU: "Süresi doldu",
};

export const RANDEVU_DURUM_ETIKET: Record<string, string> = {
  TALEP: "Talep alındı",
  ONAYLANDI: "Onaylandı",
  TAMAMLANDI: "Tamamlandı",
  IPTAL: "İptal",
};
