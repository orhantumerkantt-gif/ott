import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ShieldAlert, Monitor } from "lucide-react";
import { db } from "@/lib/db";
import { oturumZorunlu } from "@/lib/yetki";
import { yazilimErisimi } from "@/lib/siparis";
import { ButonLink, Uyari } from "@/components/ui";
import { kurusTL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Yazılım İndir",
  robots: { index: false, follow: false },
};

export default async function YazilimIndir({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kullanici = await oturumZorunlu(`/panel/indir/${slug}`);

  const yazilim = await db.software.findUnique({ where: { slug } });
  if (!yazilim) notFound();

  // ★ Erişim kontrolü SUNUCUDA yapılır. İndirme adresi, hakkı olmayan
  //   kullanıcının tarayıcısına HİÇ gönderilmez — sayfa kaynağına bakarak
  //   ele geçirilemez.
  const hakVar = await yazilimErisimi(kullanici.id, yazilim.id);

  if (!hakVar) {
    return (
      <section className="kapsayici max-w-lg py-20 text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-uyari/10">
          <ShieldAlert size={30} className="text-uyari" />
        </div>
        <h1 className="text-2xl font-extrabold">Bu yazılıma erişimin yok</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-metin2">
          <strong className="text-metin">{yazilim.ad}</strong> indirebilmek için
          bu yazılımı satın almalı ya da aboneliğin aktif olmalı.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButonLink href="/abonelik">Aboneliği Başlat</ButonLink>
          <ButonLink href={`/odeme/yazilim/${yazilim.slug}`} tur="ikincil">
            Tek Seferlik Satın Al — {kurusTL(yazilim.fiyatKurus)}
          </ButonLink>
        </div>
      </section>
    );
  }

  return (
    <section className="kapsayici max-w-2xl py-12">
      <Link
        href="/panel"
        className="inline-flex items-center gap-2 text-sm text-metin2 hover:text-altin-400"
      >
        <ArrowLeft size={15} /> Panelim
      </Link>

      <div className="mt-8 rounded-2xl border border-gece-700 bg-gece-850 p-7">
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-altin-500/10">
          <Download size={22} className="text-altin-400" />
        </div>

        <h1 className="text-2xl font-extrabold">{yazilim.ad}</h1>
        <p className="mt-2 text-sm text-metin2">{yazilim.kisaAciklama}</p>

        <dl className="mt-6 grid gap-3 border-y border-gece-700 py-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-metin3">Sürüm</dt>
            <dd className="mt-0.5 font-medium">{yazilim.surum}</dd>
          </div>
          <div>
            <dt className="text-xs text-metin3">Platform</dt>
            <dd className="mt-0.5 flex items-center gap-1.5 font-medium">
              <Monitor size={13} className="text-metin3" /> {yazilim.platform}
            </dd>
          </div>
        </dl>

        {yazilim.indirmeUrl ? (
          <div className="mt-6">
            {/* Dış bağlantı: yeni sekmede açılır, referrer sızdırılmaz. */}
            <a
              href={yazilim.indirmeUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-altin-400 px-5 py-4 font-semibold text-gece-950 shadow-[0_10px_30px_-12px] shadow-altin-500/60 transition-colors hover:bg-altin-300"
            >
              <Download size={18} /> {yazilim.ad} — İndir
            </a>
          </div>
        ) : (
          <div className="mt-6">
            <Uyari tur="bilgi">
              <strong>İndirme bağlantısı henüz hazır değil.</strong> Erişimin
              tanımlı; dosya yüklendiğinde buradan indirebileceksin.
            </Uyari>
          </div>
        )}

        <div className="mt-6 rounded-xl border border-gece-700 bg-gece-900 p-4 text-xs leading-relaxed text-metin3">
          <strong className="text-metin2">Kullanım koşulu:</strong> Bu yazılım
          kişisel kullanımın içindir. Başkasıyla paylaşmak, çoğaltmak veya
          yeniden satmak lisans ihlalidir ve erişimin iptal edilmesine yol açar.
        </div>
      </div>
    </section>
  );
}
