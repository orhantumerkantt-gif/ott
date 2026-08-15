import type { Metadata } from "next";
import { Check, Sparkles, RefreshCw, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { kurusTL, site } from "@/lib/site";
import { BolumBasligi, ButonLink, Rozet } from "@/components/ui";

export const metadata: Metadata = {
  title: "Aylık Abonelik",
  description:
    "Tüm eğitim setlerine, tüm yazılımlara ve yeni çıkan her içeriğe tek ödemeyle " +
    "eriş. Aylık abonelik, istediğin zaman iptal.",
  alternates: { canonical: "/abonelik" },
};

export default async function AbonelikSayfasi() {
  const plan = await db.plan.findUnique({ where: { slug: "aylik" } });
  const [egitimSayisi, yazilimSayisi] = await Promise.all([
    db.course.count({ where: { yayinda: true, abonelikDahil: true } }),
    db.software.count({ where: { yayinda: true, abonelikDahil: true } }),
  ]);

  const ozellikler: string[] = plan?.ozellikler
    ? (JSON.parse(plan.ozellikler) as string[])
    : [];

  const fiyat = plan?.fiyatKurus ?? 250_000;

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_400px_at_50%_0%,rgba(255,197,61,0.12),transparent_65%)]"
        />
        <div className="kapsayici relative py-16">
          <BolumBasligi
            ustBaslik="Abonelik"
            baslik="Her şeye tek ödemeyle eriş"
            aciklama="Eğitimleri tek tek almak yerine hepsine birden abone ol. Yeni çıkan içerikler hesabına otomatik tanımlanır."
          />

          <div className="mx-auto mt-12 max-w-lg">
            <div className="relative rounded-3xl border border-altin-500/40 bg-gece-850 p-8 sm:p-10">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-altin-400 px-4 py-1.5 text-[10px] font-bold tracking-widest text-gece-950">
                EN ÇOK TERCİH EDİLEN
              </span>

              <h2 className="text-center font-baslik text-xl font-bold">
                {plan?.ad ?? "Aylık Abonelik"}
              </h2>

              <div className="mt-6 flex items-baseline justify-center gap-2">
                <b className="font-baslik text-5xl font-extrabold altin-yazi">
                  {kurusTL(fiyat)}
                </b>
                <span className="text-metin3">/ ay</span>
              </div>

              <p className="mt-3 text-center text-sm text-metin2">
                {egitimSayisi} eğitim seti · {yazilimSayisi} yazılım · Yeni içerikler dahil
              </p>

              <ul className="mt-8 grid gap-3.5">
                {ozellikler.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-[15px]">
                    <Check size={18} className="mt-0.5 shrink-0 text-altin-400" />
                    <span className="text-metin2">{o}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <ButonLink href="/odeme/abonelik" className="w-full">
                  Aboneliği Başlat
                </ButonLink>
              </div>

              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-metin3">
                <ShieldCheck size={14} className="text-basari" />
                PayTR ile 3D Secure güvenli ödeme
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="kapsayici pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          <BilgiKarti
            ikon={<Sparkles size={20} className="text-altin-400" />}
            baslik="Yeni içerik otomatik"
            metin="Yeni bir eğitim veya yazılım yayınlandığında ekstra ödeme yapmadan hesabına tanımlanır."
          />
          <BilgiKarti
            ikon={<RefreshCw size={20} className="text-altin-400" />}
            baslik="İstediğin zaman iptal"
            metin="Taahhüt yok. İptal ettiğinde dönem sonuna kadar erişimin devam eder, sonrasında yenilenmez."
          />
          <BilgiKarti
            ikon={<ShieldCheck size={20} className="text-altin-400" />}
            baslik="Güvenli ödeme"
            metin="Kart bilgilerin bize ulaşmaz. Ödeme PayTR altyapısında, bankanın 3D Secure doğrulamasıyla alınır."
          />
        </div>

        <div className="mt-10 rounded-2xl border border-gece-700 bg-gece-900 p-6 text-sm leading-relaxed text-metin2">
          <h3 className="mb-3 font-baslik text-base font-bold text-metin">
            Abonelik nasıl işliyor?
          </h3>
          <ol className="grid list-decimal gap-2 pl-5">
            <li>Ücretsiz üye olursun (e-posta ve şifre yeterli).</li>
            <li>Aboneliği başlatıp ödemeyi tamamlarsın.</li>
            <li>
              Ödeme onaylandığı anda tüm eğitimler ve yazılımlar panelinde açılır.
            </li>
            <li>
              Her ay aynı gün otomatik yenilenir. İptal edersen dönem sonunda durur.
            </li>
          </ol>
          <p className="mt-4 text-xs text-metin3">
            Dijital içerik olduğu için, ödeme onaylandıktan sonra cayma hakkı
            mevzuat gereği kullanılamaz ve iade yapılmaz. Aboneliği istediğin zaman
            iptal edebilirsin; ödediğin dönemin sonuna kadar erişimin devam eder.
            Ayrıntılar{" "}
            <a href="/yasal/iade-politikasi" className="text-altin-400 hover:underline">
              İptal ve İade Politikası
            </a>{" "}
            sayfasında.
          </p>
        </div>
      </section>
    </>
  );
}

function BilgiKarti({
  ikon,
  baslik,
  metin,
}: {
  ikon: React.ReactNode;
  baslik: string;
  metin: string;
}) {
  return (
    <div className="rounded-2xl border border-gece-700 bg-gece-850 p-6">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-altin-500/10">
        {ikon}
      </div>
      <h3 className="font-baslik text-base font-bold">{baslik}</h3>
      <p className="mt-2 text-sm leading-relaxed text-metin2">{metin}</p>
    </div>
  );
}
