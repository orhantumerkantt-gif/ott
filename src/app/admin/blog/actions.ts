"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { adminZorunlu } from "@/lib/yetki";
import { slugYap, type FormDurum } from "@/lib/slug";

export type { FormDurum };

const sema = z.object({
  baslik: z.string().trim().min(3, "Başlık en az 3 karakter olmalı.").max(200),
  slug: z.string().trim().max(80).optional().or(z.literal("")),
  ozet: z.string().trim().min(20, "Özet en az 20 karakter olmalı.").max(400),
  icerik: z.string().trim().min(50, "İçerik en az 50 karakter olmalı."),
  etiketler: z.string().trim().max(200).optional().or(z.literal("")),
  seoBaslik: z.string().trim().max(200).optional().or(z.literal("")),
  seoAciklama: z.string().trim().max(400).optional().or(z.literal("")),
  yayinda: z.string().optional(),
});

export async function yaziKaydet(
  yaziId: string | null,
  _oncekiDurum: FormDurum,
  formData: FormData,
): Promise<FormDurum> {
  await adminZorunlu();

  const sonuc = sema.safeParse({
    baslik: formData.get("baslik"),
    slug: formData.get("slug"),
    ozet: formData.get("ozet"),
    icerik: formData.get("icerik"),
    etiketler: formData.get("etiketler"),
    seoBaslik: formData.get("seoBaslik"),
    seoAciklama: formData.get("seoAciklama"),
    yayinda: formData.get("yayinda") ?? undefined,
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
  const slug = slugYap(d.slug || d.baslik);
  if (!slug) return { durum: "hata", mesaj: "Adres (slug) üretilemedi." };

  const cakisan = await db.post.findUnique({ where: { slug }, select: { id: true } });
  if (cakisan && cakisan.id !== yaziId) {
    return {
      durum: "hata",
      mesaj: "Bu adres başka bir yazıda kullanılıyor.",
      alanHatalari: { slug: "Bu adres zaten kullanılıyor." },
    };
  }

  const yayinda = d.yayinda === "on";
  const mevcut = yaziId
    ? await db.post.findUnique({ where: { id: yaziId }, select: { yayinTarihi: true } })
    : null;

  // Okuma süresi kelime sayısından hesaplanır (~200 kelime/dk).
  const kelimeSayisi = d.icerik.split(/\s+/).filter(Boolean).length;
  const okumaDk = Math.max(1, Math.round(kelimeSayisi / 200));

  const veri = {
    baslik: d.baslik,
    slug,
    ozet: d.ozet,
    icerik: d.icerik,
    etiketler: d.etiketler || "",
    seoBaslik: d.seoBaslik || null,
    seoAciklama: d.seoAciklama || null,
    yayinda,
    okumaDk,
    // Yayın tarihi bir kez damgalanır; sonraki düzenlemeler onu değiştirmez.
    yayinTarihi: yayinda ? (mevcut?.yayinTarihi ?? new Date()) : mevcut?.yayinTarihi ?? null,
  };

  const kayit = yaziId
    ? await db.post.update({ where: { id: yaziId }, data: veri })
    : await db.post.create({ data: veri });

  revalidatePath("/blog");
  revalidatePath(`/blog/${kayit.slug}`);
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${kayit.id}?kaydedildi=1`);
}

export async function yaziSil(yaziId: string) {
  await adminZorunlu();
  await db.post.delete({ where: { id: yaziId } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}
