"use server";

import { z } from "zod";
import { db } from "@/lib/db";

export type IletisimDurum =
  | { durum: "bos" }
  | { durum: "basarili" }
  | { durum: "hata"; mesaj: string; alanHatalari?: Record<string, string> };

const sema = z.object({
  adSoyad: z.string().trim().min(2, "Adını yazar mısın?").max(120),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta yaz."),
  telefon: z.string().trim().max(30).optional().or(z.literal("")),
  mesaj: z.string().trim().min(10, "Biraz daha ayrıntı yazar mısın?").max(4000),
});

export async function mesajGonder(
  _oncekiDurum: IletisimDurum,
  formData: FormData,
): Promise<IletisimDurum> {
  // Bal küpü doluysa bot demektir: başarılı gibi davran, kaydetme.
  // Hata döndürmek botlara "yakalandın" bilgisi verir ve deneme yapmaya devam ederler.
  if (formData.get("website")) return { durum: "basarili" };

  const sonuc = sema.safeParse({
    adSoyad: formData.get("adSoyad"),
    email: formData.get("email"),
    telefon: formData.get("telefon"),
    mesaj: formData.get("mesaj"),
  });

  if (!sonuc.success) {
    const alanHatalari: Record<string, string> = {};
    for (const konu of sonuc.error.issues) {
      const alan = String(konu.path[0]);
      if (!alanHatalari[alan]) alanHatalari[alan] = konu.message;
    }
    return { durum: "hata", mesaj: "Lütfen işaretli alanları düzelt.", alanHatalari };
  }

  try {
    await db.lead.create({
      data: {
        adSoyad: sonuc.data.adSoyad,
        email: sonuc.data.email,
        telefon: sonuc.data.telefon || null,
        mesaj: sonuc.data.mesaj,
        kaynak: "iletisim",
      },
    });
    return { durum: "basarili" };
  } catch {
    return {
      durum: "hata",
      mesaj: "Mesaj kaydedilemedi. Lütfen biraz sonra tekrar dene.",
    };
  }
}
