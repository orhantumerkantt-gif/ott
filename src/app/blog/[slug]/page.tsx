import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

const tarihBicimi = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const yazi = await db.post.findUnique({ where: { slug } });
  if (!yazi) return { title: "Yazı bulunamadı" };

  return {
    title: yazi.seoBaslik ?? yazi.baslik,
    description: yazi.seoAciklama ?? yazi.ozet,
    alternates: { canonical: `/blog/${yazi.slug}` },
    openGraph: {
      type: "article",
      title: yazi.baslik,
      description: yazi.ozet,
      publishedTime: yazi.yayinTarihi?.toISOString(),
    },
  };
}

export default async function BlogYazisi({ params }: Props) {
  const { slug } = await params;
  const yazi = await db.post.findUnique({ where: { slug } });

  if (!yazi || !yazi.yayinda) notFound();

  return (
    <article className="kapsayici max-w-3xl py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-metin2 hover:text-altin-400"
      >
        <ArrowLeft size={15} /> Tüm yazılar
      </Link>

      <header className="mt-8">
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-metin3">
          {yazi.yayinTarihi && (
            <time dateTime={yazi.yayinTarihi.toISOString()}>
              {tarihBicimi.format(yazi.yayinTarihi)}
            </time>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock size={12} /> {yazi.okumaDk} dk okuma
          </span>
        </div>

        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          {yazi.baslik}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-metin2">{yazi.ozet}</p>
      </header>

      <div className="prose prose-dedektif mt-10 max-w-none prose-headings:font-baslik">
        <MarkdownIcerik metin={yazi.icerik} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: yazi.baslik,
            description: yazi.ozet,
            datePublished: yazi.yayinTarihi?.toISOString(),
            dateModified: yazi.updatedAt.toISOString(),
            author: { "@type": "Person", name: site.tamAd, url: site.url },
            mainEntityOfPage: `${site.url}/blog/${yazi.slug}`,
          }),
        }}
      />
    </article>
  );
}

/**
 * Küçük Markdown çevirici.
 *
 * Tam bir Markdown kütüphanesi (react-markdown + remark) ~60 KB istemci JS
 * getiriyor ve blog yazısı için bu yük INP'ye doğrudan zarar veriyor.
 * İhtiyacımız olan altı işaret var; onları sunucuda dönüştürüp saf HTML
 * gönderiyoruz. Yazıları Orhan panelden gireceği için girdi güvenilir
 * kabul ediliyor; yine de HTML kaçışı yapılır.
 */
function MarkdownIcerik({ metin }: { metin: string }) {
  const kacir = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const satirIci = (s: string) =>
    kacir(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');

  const html: string[] = [];
  let listeAcik = false;

  for (const ham of metin.split("\n")) {
    const satir = ham.trimEnd();

    if (/^\s*[-*]\s+/.test(satir)) {
      if (!listeAcik) {
        html.push("<ul>");
        listeAcik = true;
      }
      html.push(`<li>${satirIci(satir.replace(/^\s*[-*]\s+/, ""))}</li>`);
      continue;
    }
    if (listeAcik) {
      html.push("</ul>");
      listeAcik = false;
    }

    if (!satir.trim()) continue;

    const baslik = satir.match(/^(#{1,4})\s+(.*)$/);
    if (baslik) {
      const seviye = baslik[1].length + 1; // # -> h2 (h1 sayfa başlığı)
      html.push(`<h${seviye}>${satirIci(baslik[2])}</h${seviye}>`);
      continue;
    }

    html.push(`<p>${satirIci(satir)}</p>`);
  }
  if (listeAcik) html.push("</ul>");

  return <div dangerouslySetInnerHTML={{ __html: html.join("\n") }} />;
}
