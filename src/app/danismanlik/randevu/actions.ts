"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { oturumVarsa } from "@/lib/yetki";
import { site } from "@/lib/site";
import { epostaGonder, epostaSablonu } from "@/lib/eposta";

export type RandevuDurum =
  | { durum: "bos" }
  | { durum: "hata"; mesaj: string; alanHatalari?: Record<string, string> };

const sema = z.object({
  adSoyad: z.string().trim().min(2, "Adını ve soyadını yaz.").max(120),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta yaz."),
  telefon: z.string().trim().min(7, "Telefon numaranı yaz.").max(30),
  kanalAdresi: z.string().trim().max(300).optional().or(z.literal("")),
  konu: z.string().trim().min(20, "Neyi konuşmak istediğini biraz açar mısın?").max(3000),
  tercihTarih: z.string().trim().min(3, "Ne zaman uygun olduğunu yaz.").max(200),
});

export async function randevuTalepEt(
  _oncekiDurum: RandevuDurum,
  formData: FormData,
): Promise<RandevuDurum> {
  // Bal küpü: bot doldurursa sessizce başarılı gibi davran.
  if (formData.get("website")) redirect("/danismanlik/randevu?alindi=1");

  const sonuc = sema.safeParse({
    adSoyad: formData.get("adSoyad"),
    email: formData.get("email"),
    telefon: formData.get("telefon"),
    kanalAdresi: formData.get("kanalAdresi"),
    konu: formData.get("konu"),
    tercihTarih: formData.get("tercihTarih"),
  });

  if (!sonuc.success) {
    const alanHatalari: Record<string, string> = {};
    for (const k of sonuc.error.issues) {
      const alan = String(k.path[0]);
      if (!alanHatalari[alan]) alanHatalari[alan] = k.message;
    }
    return { durum: "hata", mesaj: "Lütfen işaretli alanları düzelt.", alanHatalari };
  }

  const d = sonuc.data;
  const kullanici = await oturumVarsa();

  const notlar = d.kanalAdresi ? `Kanal/profil: ${d.kanalAdresi}` : null;

  await db.booking.create({
    data: {
      userId: kullanici?.id ?? null,
      adSoyad: d.adSoyad,
      email: d.email,
      telefon: d.telefon,
      konu: d.konu,
      tercihTarih: d.tercihTarih,
      notlar,
      durum: "TALEP",
    },
  });

  // Orhan'a bildirim. Gönderilemezse talep yine de kayıtlı kalır —
  // e-posta hatası yüzünden müşteri kaybedilmemeli.
  try {
    await epostaGonder({
      kime: site.iletisim.email,
      konu: `Yeni danışmanlık talebi — ${d.adSoyad}`,
      html: epostaSablonu(
        "Yeni danışmanlık talebi",
        `<p><strong>${d.adSoyad}</strong> danışmanlık talebi gönderdi.</p>
         <p><strong>E-posta:</strong> ${d.email}<br>
            <strong>Telefon:</strong> ${d.telefon}<br>
            <strong>Tercih ettiği zaman:</strong> ${d.tercihTarih}
            ${notlar ? `<br><strong>${notlar}</strong>` : ""}</p>
         <p><strong>Konu:</strong><br>${d.konu.replace(/\n/g, "<br>")}</p>`,
        "Yönetim Panelinde Aç",
        `${site.url}/admin/randevular`,
      ),
    });
  } catch (e) {
    console.error("[randevu] Bildirim e-postası gönderilemedi:", e);
  }

  redirect("/danismanlik/randevu?alindi=1");
}
