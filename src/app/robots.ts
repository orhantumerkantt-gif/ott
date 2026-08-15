import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Arama motorlarına "neyi tara, neyi tarama" der.
 * Adres: /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin", // yönetim paneli
        "/panel", // üyeye özel alan
        "/odeme", // ödeme akışı — indekslenirse arama sonucunda sipariş sayfası çıkar
        "/api", // arka uç uçları
        "/giris",
        "/kayit",
        "/sifremi-unuttum",
        "/sifre-sifirla",
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
