import type { Metadata } from "next";
import Image from "next/image";
import { Video, ClipboardList, TrendingUp, MessageSquare } from "lucide-react";
import { fiyatlar, kurusTL, site } from "@/lib/site";
import { BolumBasligi, ButonLink, Rozet } from "@/components/ui";

export const metadata: Metadata = {
  title: "Birebir Danışmanlık",
  description:
    "Kanalını birlikte inceleyelim. 60 dakikalık canlı görüşmede içerik stratejisi, " +
    "algoritma, gelir modeli ve büyüme planı üzerine sana özel yol haritası çıkarıyoruz.",
  alternates: { canonical: "/danismanlik" },
};

const adimlar = [
  {
    ikon: <ClipboardList size={20} className="text-altin-400" />,
    baslik: "1. Ön hazırlık",
    metin:
      "Randevu formunu doldurursun. Görüşmeden önce kanalını, rakiplerini ve " +
      "verilerini inceliyorum — görüşmeye hazır gelirim.",
  },
  {
    ikon: <Video size={20} className="text-altin-400" />,
    baslik: "2. Canlı görüşme",
    metin:
      "60 dakika, ekran paylaşımlı, birebir. Kanalını beraber açıyoruz, " +
      "sorularını tek tek cevaplıyorum.",
  },
  {
    ikon: <TrendingUp size={20} className="text-altin-400" />,
    baslik: "3. Yol haritası",
    metin:
      "Görüşme sonunda elinde uygulanabilir, sıralanmış bir eylem listesi oluyor. " +
      "Kayıt da sende kalıyor.",
  },
];

const konular = [
  "Kanal analizi: neyi doğru, neyi yanlış yapıyorsun",
  "Niş ve konumlandırma seçimi",
  "İçerik stratejisi ve yayın takvimi",
  "Algoritma: izlenme süresi ve elde tutma optimizasyonu",
  "Başlık, kapak ve ilk 3 saniye kurgusu",
  "Gelir modelleri: reklam dışı kazanç yolları",
  "Yapay zekâ araçlarıyla üretim hattı kurma",
  "Telif ve kanal güvenliği riskleri",
];

export default function DanismanlikSayfasi() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_420px_at_78%_10%,rgba(255,197,61,0.12),transparent_62%)]"
        />
        <div className="kapsayici relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Rozet className="mb-6">
              <MessageSquare size={13} /> Birebir · 60 dakika · Ekran paylaşımlı
            </Rozet>

            <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl">
              Kanalını birlikte <span className="altin-yazi">masaya yatıralım</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-metin2 sm:text-[17px]">
              Genel tavsiye değil — <strong className="text-metin">senin kanalına özel</strong>{" "}
              analiz. Nerede tıkandığını birlikte bulup, sıradaki adımlarını
              netleştiriyoruz.
            </p>

            <div className="mt-8 flex items-baseline gap-3">
              <b className="font-baslik text-4xl font-extrabold">
                {kurusTL(fiyatlar.danismanlikSaatlikKurus)}
              </b>
              <span className="text-metin3">/ saat</span>
            </div>

            <div className="mt-7">
              <ButonLink href="/danismanlik/randevu">Randevu Talep Et</ButonLink>
            </div>

            <p className="mt-4 text-xs text-metin3">
              Talebini aldıktan sonra uygun saatler için seninle iletişime geçiyorum.
              Ödeme, tarih kesinleştikten sonra alınır.
            </p>
          </div>

          <div className="flex justify-center">
            <Image
              src="/gorseller/orhan-takim-elbise.webp"
              alt="Orhan Tümerkan"
              width={1400}
              height={1163}
              priority
              sizes="(max-width: 1024px) 80vw, 460px"
              className="max-h-[400px] w-auto object-contain drop-shadow-[0_24px_46px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-gece-700 bg-gece-900 py-16">
        <div className="kapsayici">
          <BolumBasligi ustBaslik="Nasıl işliyor" baslik="Üç adımda" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {adimlar.map((a) => (
              <div
                key={a.baslik}
                className="rounded-2xl border border-gece-700 bg-gece-850 p-6"
              >
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-altin-500/10">
                  {a.ikon}
                </div>
                <h3 className="font-baslik text-base font-bold">{a.baslik}</h3>
                <p className="mt-2 text-sm leading-relaxed text-metin2">{a.metin}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kapsayici py-16">
        <BolumBasligi
          ustBaslik="Kapsam"
          baslik="Görüşmede neler konuşuyoruz?"
          aciklama="Aşağıdakilerin hepsi masada. Önceliği senin ihtiyacın belirliyor."
        />

        <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {konular.map((k) => (
            <li
              key={k}
              className="flex items-start gap-3 rounded-xl border border-gece-700 bg-gece-850 p-4 text-sm text-metin2"
            >
              <span className="mt-0.5 font-bold text-altin-400">✓</span>
              {k}
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <ButonLink href="/danismanlik/randevu">
            Randevu Talep Et — {kurusTL(fiyatlar.danismanlikSaatlikKurus)}/saat
          </ButonLink>
        </div>
      </section>
    </>
  );
}
