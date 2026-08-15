import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, CreditCard } from "lucide-react";
import { db } from "@/lib/db";
import { oturumVarsa } from "@/lib/yetki";
import { fiyatlar, kurusTL, site } from "@/lib/site";
import { ButonLink, Uyari } from "@/components/ui";
import { RandevuFormu } from "./form";

export const metadata: Metadata = {
  title: "Danışmanlık Randevusu",
  description:
    "Birebir danışmanlık için randevu talebi bırak. Uygun saatler için seninle iletişime geçiyorum.",
  alternates: { canonical: "/danismanlik/randevu" },
};

export default async function RandevuSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ alindi?: string }>;
}) {
  const { alindi } = await searchParams;

  if (alindi) {
    return (
      <section className="kapsayici max-w-lg py-20 text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-basari/10">
          <CheckCircle2 size={32} className="text-basari" />
        </div>
        <h1 className="text-3xl font-extrabold">Talebin bana ulaştı</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-metin2">
          Kanalını inceleyip uygun saatler için sana döneceğim. Genellikle
          1-2 iş günü sürüyor.
        </p>

        <div className="mt-6 rounded-xl border border-gece-700 bg-gece-900 p-5 text-left text-sm text-metin2">
          <h2 className="mb-3 font-baslik text-sm font-bold text-metin">Sırada ne var?</h2>
          <ol className="grid list-decimal gap-2 pl-5">
            <li>Kanalını ve verilerini inceliyorum.</li>
            <li>Uygun saatleri paylaşıp birlikte tarih belirliyoruz.</li>
            <li>Tarih kesinleşince ödeme bağlantısını gönderiyorum.</li>
            <li>Görüşme günü ekran paylaşımlı buluşuyoruz.</li>
          </ol>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButonLink href="/">Ana Sayfaya Dön</ButonLink>
          <ButonLink href="/egitimler" tur="ikincil">
            Eğitimlere Göz At
          </ButonLink>
        </div>
      </section>
    );
  }

  const kullanici = await oturumVarsa();
  const kullaniciBilgi = kullanici
    ? await db.user.findUnique({
        where: { id: kullanici.id },
        select: { adSoyad: true, email: true, telefon: true },
      })
    : null;

  return (
    <section className="kapsayici max-w-4xl py-14">
      <Link
        href="/danismanlik"
        className="inline-flex items-center gap-2 text-sm text-metin2 hover:text-altin-400"
      >
        <ArrowLeft size={15} /> Danışmanlık
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h1 className="text-3xl font-extrabold leading-tight">Randevu talebi</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-metin2">
            Formu doldur, kanalını inceleyip uygun saatler için sana döneyim.
          </p>

          <div className="mt-7 grid gap-4">
            <Bilgi
              ikon={<Clock size={17} className="text-altin-400" />}
              baslik="60 dakika"
              metin="Ekran paylaşımlı, birebir görüşme. Kayıt sende kalır."
            />
            <Bilgi
              ikon={<CreditCard size={17} className="text-altin-400" />}
              baslik={`${kurusTL(fiyatlar.danismanlikSaatlikKurus)} / saat`}
              metin="Ödeme, tarih kesinleştikten sonra alınır. Şimdi ödeme yapmıyorsun."
            />
          </div>

          <div className="mt-6">
            <Uyari tur="bilgi">
              Görüşmeden <strong>24 saat öncesine kadar</strong> ücretsiz iptal veya
              erteleme yapabilirsin.
            </Uyari>
          </div>
        </div>

        <RandevuFormu
          varsayilan={{
            adSoyad: kullaniciBilgi?.adSoyad ?? "",
            email: kullaniciBilgi?.email ?? "",
            telefon: kullaniciBilgi?.telefon ?? "",
          }}
        />
      </div>
    </section>
  );
}

function Bilgi({
  ikon,
  baslik,
  metin,
}: {
  ikon: React.ReactNode;
  baslik: string;
  metin: string;
}) {
  return (
    <div className="flex gap-3.5 rounded-xl border border-gece-700 bg-gece-850 p-4">
      <div className="mt-0.5 shrink-0">{ikon}</div>
      <div>
        <h3 className="font-baslik text-sm font-bold">{baslik}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-metin2">{metin}</p>
      </div>
    </div>
  );
}
