import type { Metadata } from "next";
import { CheckCircle2, Clock } from "lucide-react";
import { ButonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ödeme Alındı",
  robots: { index: false, follow: false },
};

export default function OdemeBasariliSayfasi() {
  return (
    <section className="kapsayici max-w-lg py-20 text-center">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-basari/10">
        <CheckCircle2 size={32} className="text-basari" />
      </div>

      <h1 className="text-3xl font-extrabold">Ödemen alındı</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-metin2">
        Teşekkürler! Ödemen bankadan onaylandı. Erişimin panelinde açılıyor.
      </p>

      <div className="mt-6 rounded-xl border border-gece-700 bg-gece-900 p-4 text-left text-sm text-metin2">
        <p className="flex items-start gap-2.5">
          <Clock size={16} className="mt-0.5 shrink-0 text-altin-400" />
          <span>
            Erişimin panelinde <strong className="text-metin">birkaç saniye içinde</strong>{" "}
            görünür. Hemen görünmüyorsa sayfayı yenile — banka onayının bize ulaşması
            bazen kısa sürebiliyor.
          </span>
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButonLink href="/panel">Panelime Git</ButonLink>
        <ButonLink href="/egitimler" tur="ikincil">
          Eğitimlere Göz At
        </ButonLink>
      </div>
    </section>
  );
}
