"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { ROL } from "@/lib/sabitler";
import { epostaGonder, epostaSablonu } from "@/lib/eposta";
import { site } from "@/lib/site";

async function yeniUyeBildirimleri(adSoyad: string, email: string) {
  await epostaGonder({
    kime: email,
    konu: `Aramıza hoş geldin, ${adSoyad.split(" ")[0]}!`,
    html: epostaSablonu(
      "Hesabın hazır",
      `<p>Merhaba ${adSoyad},</p>
       <p>${site.ad} ailesine katıldın. Artık ücretsiz önizleme derslerini
          izleyebilir, eğitim setlerine ve aylık aboneliğe göz atabilirsin.</p>
       <p>Sorun olursa bu e-postayı yanıtlaman yeterli.</p>`,
      "Panelime Git",
      `${site.url}/panel`,
    ),
    duzMetin: `Merhaba ${adSoyad}, ${site.ad} hesabın hazır: ${site.url}/panel`,
  });

  await epostaGonder({
    kime: site.iletisim.email,
    konu: `👤 Yeni üye — ${adSoyad}`,
    html: epostaSablonu(
      "Yeni üye kaydı",
      `<p><strong>${adSoyad}</strong> siteye üye oldu.</p>
       <p><strong>E-posta:</strong> ${email}</p>`,
      "Üyeleri Gör",
      `${site.url}/admin/uyeler`,
    ),
    duzMetin: `Yeni üye: ${adSoyad} (${email})`,
  });
}

export type KayitDurum =
  | { durum: "bos" }
  | { durum: "hata"; mesaj: string; alanHatalari?: Record<string, string> };

const sema = z
  .object({
    adSoyad: z.string().trim().min(2, "Adını ve soyadını yaz.").max(120),
    email: z.string().trim().toLowerCase().email("Geçerli bir e-posta yaz."),
    telefon: z.string().trim().max(30).optional().or(z.literal("")),
    sifre: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı.")
      .max(200)
      .regex(/[a-zA-ZğüşıöçĞÜŞİÖÇ]/, "Şifre en az bir harf içermeli.")
      .regex(/[0-9]/, "Şifre en az bir rakam içermeli."),
    sifreTekrar: z.string(),
    sozlesme: z.string().optional(),
  })
  .refine((d) => d.sifre === d.sifreTekrar, {
    message: "Şifreler birbirini tutmuyor.",
    path: ["sifreTekrar"],
  })
  .refine((d) => d.sozlesme === "on", {
    message: "Devam etmek için sözleşmeleri onaylaman gerekiyor.",
    path: ["sozlesme"],
  });

export async function kayitOl(
  _oncekiDurum: KayitDurum,
  formData: FormData,
): Promise<KayitDurum> {
  const sonuc = sema.safeParse({
    adSoyad: formData.get("adSoyad"),
    email: formData.get("email"),
    telefon: formData.get("telefon"),
    sifre: formData.get("sifre"),
    sifreTekrar: formData.get("sifreTekrar"),
    sozlesme: formData.get("sozlesme"),
  });

  if (!sonuc.success) {
    const alanHatalari: Record<string, string> = {};
    for (const k of sonuc.error.issues) {
      const alan = String(k.path[0]);
      if (!alanHatalari[alan]) alanHatalari[alan] = k.message;
    }
    return { durum: "hata", mesaj: "Lütfen işaretli alanları düzelt.", alanHatalari };
  }

  const { adSoyad, email, telefon, sifre } = sonuc.data;

  const mevcut = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (mevcut) {
    return {
      durum: "hata",
      mesaj: "Bu e-posta ile daha önce kayıt olunmuş.",
      alanHatalari: { email: "Bu e-posta zaten kayıtlı. Giriş yapmayı dene." },
    };
  }

  await db.user.create({
    data: {
      adSoyad,
      email,
      telefon: telefon || null,
      passwordHash: await bcrypt.hash(sifre, 10),
      rol: ROL.UYE,
    },
  });

  // Hoş geldin + satıcıya bildirim. Hata yutulur: e-posta gitmese bile
  // kayıt tamamlanmalı, kullanıcı kapıda kalmamalı.
  void yeniUyeBildirimleri(adSoyad, email).catch((e) =>
    console.error("[kayıt] Bildirim e-postaları gönderilemedi:", e),
  );

  // Kayıttan hemen sonra oturum aç — kullanıcıyı bir de giriş formuyla uğraştırma.
  // `redirect: false` şart: Auth.js aksi halde kendi yönlendirmesini yapıp
  // aşağıdaki redirect'i etkisiz bırakıyor.
  await signIn("credentials", { email, sifre, redirect: false });

  redirect("/panel?hosgeldin=1");
}
