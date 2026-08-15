import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { site } from "@/lib/site";

/**
 * Google'a "sitede hangi sayfalar var" listesini verir.
 * Adres: /sitemap.xml — Search Console'a bu adres bildirilir.
 *
 * ★ Üyeye özel sayfalar (panel, admin, ödeme, giriş) BİLEREK yok:
 *   Google'ın onları taraması gereksiz ve bazıları oturum ister.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const taban = site.url;

  const sabitler: MetadataRoute.Sitemap = [
    { url: `${taban}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${taban}/egitimler`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${taban}/abonelik`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${taban}/danismanlik`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${taban}/yazilimlar`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${taban}/hakkimda`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${taban}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${taban}/iletisim`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${taban}/yasal/mesafeli-satis-sozlesmesi`, priority: 0.2 },
    { url: `${taban}/yasal/on-bilgilendirme-formu`, priority: 0.2 },
    { url: `${taban}/yasal/iade-politikasi`, priority: 0.2 },
    { url: `${taban}/yasal/gizlilik-politikasi`, priority: 0.2 },
    { url: `${taban}/yasal/kvkk-aydinlatma-metni`, priority: 0.2 },
    { url: `${taban}/yasal/cerez-politikasi`, priority: 0.2 },
  ];

  // Veritabanı erişilemezse site haritası boş dönmesin diye korumalı çağrı:
  // sabit sayfalar her hâlükârda listelenir.
  let dinamik: MetadataRoute.Sitemap = [];
  try {
    const [egitimler, yazilar] = await Promise.all([
      db.course.findMany({
        where: { yayinda: true },
        select: { slug: true, updatedAt: true },
      }),
      db.post.findMany({
        where: { yayinda: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    dinamik = [
      ...egitimler.map((e) => ({
        url: `${taban}/egitimler/${e.slug}`,
        lastModified: e.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...yazilar.map((y) => ({
        url: `${taban}/blog/${y.slug}`,
        lastModified: y.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch (e) {
    console.error("[sitemap] Dinamik sayfalar okunamadı:", e);
  }

  return [...sabitler, ...dinamik];
}
