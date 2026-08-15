/**
 * Başlıktan adres-dostu slug üretir (Türkçe karakterler dönüştürülür).
 *
 * ★ Bu fonksiyon BİLEREK ayrı bir dosyada: "use server" işaretli bir dosyadan
 *   yalnız `async` fonksiyon dışa aktarılabilir. Senkron yardımcıyı orada
 *   tutmak derlemeyi kırıyor ("Server Actions must be async functions").
 */
export function slugYap(metin: string): string {
  const harita: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i", ö: "o", Ö: "o",
    ş: "s", Ş: "s", ü: "u", Ü: "u", â: "a", î: "i", û: "u",
  };
  return metin
    .split("")
    .map((h) => harita[h] ?? h)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/** Form doğrulama sonuçlarının ortak tipi. */
export type FormDurum =
  | { durum: "bos" }
  | { durum: "hata"; mesaj: string; alanHatalari?: Record<string, string> };
