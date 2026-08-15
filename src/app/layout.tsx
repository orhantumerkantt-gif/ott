import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site";
import { ROL } from "@/lib/sabitler";

/* Yazı tipleri next/font ile GÖMÜLÜ geliyor. Google'dan çalışma anında
   çekilseydi LCP gecikir ve yazılar geç oturduğu için sayfa zıplardı (CLS). */
const sora = Sora({
  subsets: ["latin", "latin-ext"], // latin-ext: ş ğ İ ı ö ü ç
  weight: ["400", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.ad} — ${site.unvan}`,
    template: `%s | ${site.ad}`,
  },
  description: site.kisaAciklama,
  keywords: [
    "yapay zeka ile para kazanma",
    "youtube kanal büyütme",
    "sosyal medya eğitimi",
    "tiktok para kazanma",
    "youtube shorts eğitimi",
    "içerik üretimi danışmanlık",
    "Orhan Tümerkan",
    "Dedektif Orhan",
  ],
  authors: [{ name: site.tamAd }],
  creator: site.tamAd,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: site.url,
    siteName: site.ad,
    title: `${site.ad} — ${site.unvan}`,
    description: site.kisaAciklama,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.ad} — ${site.unvan}`,
    description: site.kisaAciklama,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05070f",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const oturum = await auth();

  return (
    <html lang="tr" className={`${sora.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        {/* Klavyeyle gezenler her sayfada menüyü baştan geçmek zorunda kalmasın */}
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-altin-400 focus:px-4 focus:py-2 focus:font-semibold focus:text-gece-950"
        >
          İçeriğe atla
        </a>

        <SiteHeader
          girisliMi={Boolean(oturum?.user)}
          adminMi={oturum?.user?.rol === ROL.ADMIN}
        />

        <main id="icerik">{children}</main>

        <SiteFooter />
      </body>
    </html>
  );
}
