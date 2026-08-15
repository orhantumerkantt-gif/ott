"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { adminZorunlu } from "@/lib/yetki";
import { slugYap, type FormDurum } from "@/lib/slug";

export type { FormDurum };

const sema = z.object({
  ad: z.string().trim().min(2, "Ad en az 2 karakter olmalı.").max(150),
  slug: z.string().trim().max(80).optional().or(z.literal("")),
  kisaAciklama: z.string().trim().min(5, "Kısa açıklama yaz.").max(300),
  aciklama: z.string().trim().min(10, "Açıklama en az 10 karakter olmalı."),
  fiyatTL: z.coerce.number().min(0).max(1_000_000),
  surum: z.string().trim().min(1).max(30),
  platform: z.string().trim().min(1).max(60),
  indirmeUrl: z.string().trim().max(500).optional().or(z.literal("")),
  sira: z.coerce.number().int().min(0).max(9999),
  yayinda: z.string().optional(),
  abonelikDahil: z.string().optional(),
});

export async function yazilimKaydet(
  yazilimId: string | null,
  _oncekiDurum: FormDurum,
  formData: FormData,
): Promise<FormDurum> {
  await adminZorunlu();

  const sonuc = sema.safeParse({
    ad: formData.get("ad"),
    slug: formData.get("slug"),
    kisaAciklama: formData.get("kisaAciklama"),
    aciklama: formData.get("aciklama"),
    fiyatTL: formData.get("fiyatTL"),
    surum: formData.get("surum") || "1.0.0",
    platform: formData.get("platform") || "Windows",
    indirmeUrl: formData.get("indirmeUrl"),
    sira: formData.get("sira") || 0,
    yayinda: formData.get("yayinda") ?? undefined,
    abonelikDahil: formData.get("abonelikDahil") ?? undefined,
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
  const slug = slugYap(d.slug || d.ad);
  if (!slug) return { durum: "hata", mesaj: "Adres (slug) üretilemedi." };

  const cakisan = await db.software.findUnique({ where: { slug }, select: { id: true } });
  if (cakisan && cakisan.id !== yazilimId) {
    return {
      durum: "hata",
      mesaj: "Bu adres başka bir yazılımda kullanılıyor.",
      alanHatalari: { slug: "Bu adres zaten kullanılıyor." },
    };
  }

  const veri = {
    ad: d.ad,
    slug,
    kisaAciklama: d.kisaAciklama,
    aciklama: d.aciklama,
    fiyatKurus: Math.round(d.fiyatTL * 100),
    surum: d.surum,
    platform: d.platform,
    indirmeUrl: d.indirmeUrl || null,
    sira: d.sira,
    yayinda: d.yayinda === "on",
    abonelikDahil: d.abonelikDahil === "on",
  };

  const kayit = yazilimId
    ? await db.software.update({ where: { id: yazilimId }, data: veri })
    : await db.software.create({ data: veri });

  revalidatePath("/yazilimlar");
  revalidatePath("/admin/yazilimlar");
  redirect(`/admin/yazilimlar/${kayit.id}?kaydedildi=1`);
}

export async function yazilimSil(yazilimId: string) {
  await adminZorunlu();

  // Satın alınmış yazılımı silmek, alıcının indirme hakkını yok eder.
  const satisSayisi = await db.order.count({
    where: { tur: "YAZILIM", urunId: yazilimId, durum: "ODENDI" },
  });
  if (satisSayisi > 0) {
    throw new Error(
      `Bu yazılımı ${satisSayisi} kişi satın almış. Silmek yerine "Yayında" işaretini kaldır.`,
    );
  }

  await db.software.delete({ where: { id: yazilimId } });
  revalidatePath("/yazilimlar");
  revalidatePath("/admin/yazilimlar");
  redirect("/admin/yazilimlar");
}
