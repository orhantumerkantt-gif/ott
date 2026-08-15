import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/marka/logo";
import { site, yasalMenu } from "@/lib/site";

/* lucide-react 1.x MARKA ikonlarını (Youtube, Instagram, Twitter…) kaldırdı —
   telif nedeniyle. O yüzden bu ikiси elde çiziliyor. */
function YoutubeIkon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
}

function InstagramIkon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

const hizmetler = [
  { ad: "Eğitim Setleri", href: "/egitimler" },
  { ad: "Aylık Abonelik", href: "/abonelik" },
  { ad: "Birebir Danışmanlık", href: "/danismanlik" },
  { ad: "Yazılımlar", href: "/yazilimlar" },
];

const kurumsal = [
  { ad: "Hakkımda", href: "/hakkimda" },
  { ad: "Blog", href: "/blog" },
  { ad: "İletişim", href: "/iletisim" },
  { ad: "Sıkça Sorulan Sorular", href: "/#sss" },
];

export function SiteFooter() {
  const yil = new Date().getFullYear();

  return (
    <footer className="border-t border-gece-700 bg-gece-900">
      <div className="kapsayici py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo className="mb-4" />
            <p className="max-w-xs text-sm leading-relaxed text-metin2">
              {site.kisaAciklama}
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={site.sosyal.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube kanalı"
                className="rounded-lg border border-gece-600 p-2.5 text-metin2 transition-colors hover:border-altin-500 hover:text-altin-400"
              >
                <YoutubeIkon />
              </a>
              <a
                href={site.sosyal.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram hesabı"
                className="rounded-lg border border-gece-600 p-2.5 text-metin2 transition-colors hover:border-altin-500 hover:text-altin-400"
              >
                <InstagramIkon />
              </a>
              <a
                href={`mailto:${site.iletisim.email}`}
                aria-label="E-posta gönder"
                className="rounded-lg border border-gece-600 p-2.5 text-metin2 transition-colors hover:border-altin-500 hover:text-altin-400"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <FooterSutun baslik="Hizmetler" baglantilar={hizmetler} />
          <FooterSutun baslik="Kurumsal" baglantilar={kurumsal} />
          <FooterSutun baslik="Yasal" baglantilar={[...yasalMenu]} />
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-gece-700 pt-6 text-xs text-metin3">
          <span>
            © {yil} {site.tamAd} · Tüm hakları saklıdır.
          </span>
          <span>Ödeme altyapısı: PayTR · 3D Secure ile güvenli ödeme</span>
        </div>
      </div>
    </footer>
  );
}

function FooterSutun({
  baslik,
  baglantilar,
}: {
  baslik: string;
  baglantilar: readonly { ad: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="mb-4 font-baslik text-sm font-bold tracking-wide text-metin">
        {baslik}
      </h2>
      <ul className="grid gap-2.5 text-sm text-metin2">
        {baglantilar.map((b) => (
          <li key={b.href}>
            <Link href={b.href} className="transition-colors hover:text-altin-400">
              {b.ad}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
