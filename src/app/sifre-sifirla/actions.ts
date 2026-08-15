"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export type YeniSifreDurum =
  | { durum: "bos" }
  | { durum: "hata"; mesaj: string; alanHatalari?: Record<string, string> };

const sema = z
  .object({
    token: z.string().min(10),
    sifre: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı.")
      .max(200)
      .regex(/[a-zA-ZğüşıöçĞÜŞİÖÇ]/, "Şifre en az bir harf içermeli.")
      .regex(/[0-9]/, "Şifre en az bir rakam içermeli."),
    sifreTekrar: z.string(),
  })
  .refine((d) => d.sifre === d.sifreTekrar, {
    message: "Şifreler birbirini tutmuyor.",
    path: ["sifreTekrar"],
  });

export async function yeniSifreKaydet(
  _oncekiDurum: YeniSifreDurum,
  formData: FormData,
): Promise<YeniSifreDurum> {
  const sonuc = sema.safeParse({
    token: formData.get("token"),
    sifre: formData.get("sifre"),
    sifreTekrar: formData.get("sifreTekrar"),
  });

  if (!sonuc.success) {
    const alanHatalari: Record<string, string> = {};
    for (const k of sonuc.error.issues) {
      const alan = String(k.path[0]);
      if (!alanHatalari[alan]) alanHatalari[alan] = k.message;
    }
    return { durum: "hata", mesaj: "Lütfen işaretli alanları düzelt.", alanHatalari };
  }

  const kullanici = await db.user.findFirst({
    where: {
      sifreToken: sonuc.data.token,
      sifreTokenSonu: { gt: new Date() }, // süresi geçmiş token kabul edilmez
    },
    select: { id: true },
  });

  if (!kullanici) {
    return {
      durum: "hata",
      mesaj:
        "Bu bağlantı geçersiz veya süresi dolmuş. Lütfen yeni bir sıfırlama bağlantısı iste.",
    };
  }

  await db.user.update({
    where: { id: kullanici.id },
    data: {
      passwordHash: await bcrypt.hash(sonuc.data.sifre, 10),
      // Token TEK KULLANIMLIK: aynı bağlantıyla ikinci kez şifre değiştirilemesin
      sifreToken: null,
      sifreTokenSonu: null,
    },
  });

  redirect("/giris?sifirlandi=1");
}
