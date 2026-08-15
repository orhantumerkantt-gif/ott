import type { Metadata } from "next";
import { Mail, Clock, MessageSquare } from "lucide-react";
import { site } from "@/lib/site";
import { BolumBasligi } from "@/components/ui";
import { IletisimFormu } from "./form";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Soruların, iş birliği teklifin veya danışmanlık talebin için bana ulaş.",
  alternates: { canonical: "/iletisim" },
};

export default function IletisimSayfasi() {
  return (
    <section className="kapsayici py-16">
      <BolumBasligi
        ustBaslik="İletişim"
        baslik="Bana ulaş"
        aciklama="Sorularını, iş birliği tekliflerini veya geri bildirimlerini bekliyorum."
      />

      <div className="mx-auto mt-12 grid max-w-4xl gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid content-start gap-4">
          <div className="rounded-2xl border border-gece-700 bg-gece-850 p-6">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-altin-500/10">
              <Mail size={19} className="text-altin-400" />
            </div>
            <h3 className="font-baslik text-base font-bold">E-posta</h3>
            <a
              href={`mailto:${site.iletisim.email}`}
              className="mt-1 block break-all text-sm text-altin-400 hover:underline"
            >
              {site.iletisim.email}
            </a>
          </div>

          <div className="rounded-2xl border border-gece-700 bg-gece-850 p-6">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-altin-500/10">
              <Clock size={19} className="text-altin-400" />
            </div>
            <h3 className="font-baslik text-base font-bold">Yanıt süresi</h3>
            <p className="mt-1 text-sm text-metin2">
              Genellikle 1-2 iş günü içinde dönüş yapıyorum.
            </p>
            <p className="mt-1 text-xs text-metin3">{site.iletisim.calismaSaatleri}</p>
          </div>

          <div className="rounded-2xl border border-gece-700 bg-gece-850 p-6">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-altin-500/10">
              <MessageSquare size={19} className="text-altin-400" />
            </div>
            <h3 className="font-baslik text-base font-bold">Danışmanlık mı arıyorsun?</h3>
            <p className="mt-1 text-sm text-metin2">
              Birebir görüşme için{" "}
              <a href="/danismanlik" className="text-altin-400 hover:underline">
                danışmanlık sayfasından
              </a>{" "}
              randevu talebi bırakman daha hızlı olur.
            </p>
          </div>
        </div>

        <IletisimFormu />
      </div>
    </section>
  );
}
