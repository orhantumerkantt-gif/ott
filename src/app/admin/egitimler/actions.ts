"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { adminZorunlu } from "@/lib/yetki";
import { slugYap, type FormDurum } from "@/lib/slug";

export type { FormDurum };

const egitimSema = z.object({
  baslik: z.string().trim().min(3, "Başlık en az 3 karakter olmalı.").max(200),
  slug: z.string().trim().max(80).optional().or(z.literal("")),
  altBaslik: z.string().trim().max(300).optional().or(z.literal("")),
  aciklama: z.string().trim().min(10, "Açıklama en az 10 karakter olmalı."),
  seviye: z.enum(["BASLANGIC", "ORTA", "ILERI"]),
  fiyatTL: z.coerce.number().min(0, "Fiyat eksi olamaz.").max(1_000_000),
  eskiFiyatTL: z.coerce.number().min(0).max(1_000_000).optional(),
  sureDk: z.coerce.number().int().min(0).max(100_000),
  sira: z.coerce.number().int().min(0).max(9999),
  yayinda: z.string().optional(),
  oneCikan: z.string().optional(),
  abonelikDahil: z.string().optional(),
  seoBaslik: z.string().trim().max(200).optional().or(z.literal("")),
  seoAciklama: z.string().trim().max(400).optional().or(z.literal("")),
});

function formuOku(formData: FormData) {
  return egitimSema.safeParse({
    baslik: formData.get("baslik"),
    slug: formData.get("slug"),
    altBaslik: formData.get("altBaslik"),
    aciklama: formData.get("aciklama"),
    seviye: formData.get("seviye"),
    fiyatTL: formData.get("fiyatTL"),
    eskiFiyatTL: formData.get("eskiFiyatTL") || undefined,
    sureDk: formData.get("sureDk") || 0,
    sira: formData.get("sira") || 0,
    yayinda: formData.get("yayinda") ?? undefined,
    oneCikan: formData.get("oneCikan") ?? undefined,
    abonelikDahil: formData.get("abonelikDahil") ?? undefined,
    seoBaslik: formData.get("seoBaslik"),
    seoAciklama: formData.get("seoAciklama"),
  });
}

function hatalariTopla(hata: z.ZodError) {
  const alanHatalari: Record<string, string> = {};
  for (const k of hata.issues) {
    const alan = String(k.path[0]);
    if (!alanHatalari[alan]) alanHatalari[alan] = k.message;
  }
  return alanHatalari;
}

export async function egitimKaydet(
  egitimId: string | null,
  _oncekiDurum: FormDurum,
  formData: FormData,
): Promise<FormDurum> {
  await adminZorunlu();

  const sonuc = formuOku(formData);
  if (!sonuc.success) {
    return {
      durum: "hata",
      mesaj: "Lütfen işaretli alanları düzelt.",
      alanHatalari: hatalariTopla(sonuc.error),
    };
  }

  const d = sonuc.data;
  const slug = slugYap(d.slug || d.baslik);
  if (!slug) {
    return {
      durum: "hata",
      mesaj: "Adres (slug) üretilemedi. Başlıkta en az bir harf veya rakam olmalı.",
    };
  }

  // Aynı slug başka bir eğitimde varsa çakışır: eğitim sayfası yanlış kaydı açar.
  const cakisan = await db.course.findUnique({ where: { slug }, select: { id: true } });
  if (cakisan && cakisan.id !== egitimId) {
    return {
      durum: "hata",
      mesaj: "Bu adres (slug) başka bir eğitimde kullanılıyor. Farklı bir başlık ya da adres yaz.",
      alanHatalari: { slug: "Bu adres zaten kullanılıyor." },
    };
  }

  const veri = {
    baslik: d.baslik,
    slug,
    altBaslik: d.altBaslik || null,
    aciklama: d.aciklama,
    seviye: d.seviye,
    // Fiyat KURUŞ olarak saklanır; kayan noktalı sayı hatası olmasın diye
    // yuvarlanarak tam sayıya çevrilir.
    fiyatKurus: Math.round(d.fiyatTL * 100),
    eskiFiyatKurus: d.eskiFiyatTL ? Math.round(d.eskiFiyatTL * 100) : null,
    sureDk: d.sureDk,
    sira: d.sira,
    yayinda: d.yayinda === "on",
    oneCikan: d.oneCikan === "on",
    abonelikDahil: d.abonelikDahil === "on",
    seoBaslik: d.seoBaslik || null,
    seoAciklama: d.seoAciklama || null,
  };

  const kayit = egitimId
    ? await db.course.update({ where: { id: egitimId }, data: veri })
    : await db.course.create({ data: veri });

  revalidatePath("/egitimler");
  revalidatePath(`/egitimler/${kayit.slug}`);
  revalidatePath("/admin/egitimler");
  redirect(`/admin/egitimler/${kayit.id}?kaydedildi=1`);
}

export async function egitimSil(egitimId: string) {
  await adminZorunlu();

  // Satın alınmış bir eğitimi silmek, o kişilerin erişimini yok eder.
  const kayitSayisi = await db.enrollment.count({ where: { courseId: egitimId } });
  if (kayitSayisi > 0) {
    throw new Error(
      `Bu eğitimi ${kayitSayisi} kişi satın almış. Silmek yerine "Yayında" işaretini kaldır — ` +
        "böylece yeni satış olmaz ama mevcut alıcılar erişimini kaybetmez.",
    );
  }

  await db.course.delete({ where: { id: egitimId } });
  revalidatePath("/egitimler");
  revalidatePath("/admin/egitimler");
  redirect("/admin/egitimler");
}

/* ── Dersler ─────────────────────────────────────────────────────── */

const dersSema = z.object({
  baslik: z.string().trim().min(2, "Ders başlığı en az 2 karakter olmalı.").max(200),
  videoUrl: z.string().trim().max(500).optional().or(z.literal("")),
  sureDk: z.coerce.number().int().min(0).max(1000),
  ucretsizOnizleme: z.string().optional(),
});

export async function dersEkle(
  courseId: string,
  _oncekiDurum: FormDurum,
  formData: FormData,
): Promise<FormDurum> {
  await adminZorunlu();

  const sonuc = dersSema.safeParse({
    baslik: formData.get("baslik"),
    videoUrl: formData.get("videoUrl"),
    sureDk: formData.get("sureDk") || 0,
    ucretsizOnizleme: formData.get("ucretsizOnizleme") ?? undefined,
  });

  if (!sonuc.success) {
    return {
      durum: "hata",
      mesaj: "Ders eklenemedi.",
      alanHatalari: hatalariTopla(sonuc.error),
    };
  }

  const sonSira = await db.lesson.aggregate({
    where: { courseId },
    _max: { sira: true },
  });

  await db.lesson.create({
    data: {
      courseId,
      baslik: sonuc.data.baslik,
      videoUrl: sonuc.data.videoUrl || null,
      sureDk: sonuc.data.sureDk,
      ucretsizOnizleme: sonuc.data.ucretsizOnizleme === "on",
      sira: (sonSira._max.sira ?? 0) + 1,
    },
  });

  revalidatePath(`/admin/egitimler/${courseId}`);
  return { durum: "bos" };
}

export async function dersSil(dersId: string, courseId: string) {
  await adminZorunlu();
  await db.lesson.delete({ where: { id: dersId } });
  revalidatePath(`/admin/egitimler/${courseId}`);
}

export async function dersTasi(dersId: string, courseId: string, yon: "yukari" | "asagi") {
  await adminZorunlu();

  const dersler = await db.lesson.findMany({
    where: { courseId },
    orderBy: { sira: "asc" },
  });
  const i = dersler.findIndex((d) => d.id === dersId);
  if (i === -1) return;

  const hedef = yon === "yukari" ? i - 1 : i + 1;
  if (hedef < 0 || hedef >= dersler.length) return;

  // Sıra numaralarını takas et. Doğrudan atama yerine takas kullanılıyor:
  // araya elle eklenmiş kayıtlarda boşluk/çakışma oluşmasın.
  await db.$transaction([
    db.lesson.update({ where: { id: dersler[i].id }, data: { sira: dersler[hedef].sira } }),
    db.lesson.update({ where: { id: dersler[hedef].id }, data: { sira: dersler[i].sira } }),
  ]);

  revalidatePath(`/admin/egitimler/${courseId}`);
}
