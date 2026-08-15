import type { Metadata } from "next";
import { XCircle } from "lucide-react";
import { site } from "@/lib/site";
import { ButonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ödeme Tamamlanamadı",
  robots: { index: false, follow: false },
};

const olasiSebepler = [
  "Kartın internetten alışverişe kapalı olabilir",
  "Kart limiti yetersiz olabilir",
  "3D Secure doğrulaması tamamlanmamış olabilir",
  "Kart bilgileri hatalı girilmiş olabilir",
];

export default function OdemeBasarisizSayfasi() {
  return (
    <section className="kapsayici max-w-lg py-20 text-center">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-hata/10">
        <XCircle size={32} className="text-hata" />
      </div>

      <h1 className="text-3xl font-extrabold">Ödeme tamamlanamadı</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-metin2">
        İşlem gerçekleşmedi ve <strong className="text-metin">kartından para çekilmedi.</strong>
      </p>

      <div className="mt-6 rounded-xl border border-gece-700 bg-gece-900 p-5 text-left">
        <h2 className="mb-3 font-baslik text-sm font-bold">Olası sebepler</h2>
        <ul className="grid gap-2 text-sm text-metin2">
          {olasiSebepler.map((s) => (
            <li key={s} className="flex gap-2.5">
              <span className="text-metin3">•</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButonLink href="/abonelik">Tekrar Dene</ButonLink>
        <ButonLink href="/iletisim" tur="ikincil">
          Yardım İste
        </ButonLink>
      </div>

      <p className="mt-6 text-xs text-metin3">
        Sorun devam ederse{" "}
        <a href={`mailto:${site.iletisim.email}`} className="text-altin-400 hover:underline">
          {site.iletisim.email}
        </a>{" "}
        adresinden bana yazabilirsin.
      </p>
    </section>
  );
}
