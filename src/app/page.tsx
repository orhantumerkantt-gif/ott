import Image from "next/image";
import type { Metadata } from "next";
import { GraduationCap, Star, Target, Search, ShieldCheck } from "lucide-react";
import { ButonLink, Rozet, BolumBasligi } from "@/components/ui";
import { site, fiyatlar, kurusTL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.ad} — ${site.unvan}`,
  description: site.kisaAciklama,
  alternates: { canonical: "/" },
};

/* Rakamlar EKRAN GÖRÜNTÜSÜ olarak değil, tipografiyle gösterilir.
   Ham ekran görüntüleri farklı boyut/renkte olduğu için yan yana
   konduğunda dağınık duruyordu; kanıt olarak aşağıdaki ızgarada,
   tek tip kutularda sunuluyorlar. */
const rakamlar = [
  { deger: "10 Milyar+", etiket: "Toplam izlenme", kaynak: "Yönettiğim kanallarda" },
  { deger: "1.000.006", etiket: "Tek kanalda abone", kaynak: "YouTube Analytics" },
  { deger: "90+", etiket: "YouTube ödül plaketi", kaynak: "10 altın · 80 gümüş" },
  { deger: "14 yıl", etiket: "Sahada üretim tecrübesi", kaynak: "2012'den beri" },
];

const kanitlar = [
  {
    gorsel: "/gorseller/kanit-142bin-tl.webp",
    baslik: "₺142.027",
    aciklama: "Kanal ömrü boyunca tahmini gelir",
  },
  {
    gorsel: "/gorseller/kanit-4milyon-izlenme.webp",
    baslik: "4.183.324 izlenme",
    aciklama: "28 günde · ₺36.027 gelir",
  },
  {
    gorsel: "/gorseller/kanit-53bin-abone-gelir.webp",
    baslik: "+44.714 abone",
    aciklama: "28 günde · 10,8 Mn görüntüleme",
  },
  {
    gorsel: "/gorseller/kanit-creativity-43k.webp",
    baslik: "$43.170",
    aciklama: "TikTok Creativity Program",
  },
];

const sss = [
  {
    soru: "Hiç deneyimim yok, yine de başlayabilir miyim?",
    cevap:
      "Evet. Eğitimler sıfırdan başlayacak şekilde kurgulandı: kanal açmaktan " +
      "içerik üretimine, para kazanma şartlarını sağlamaktan gelir modellerine kadar " +
      "adım adım ilerliyoruz.",
  },
  {
    soru: "Abonelik ile eğitim seti satın almak arasındaki fark ne?",
    cevap:
      "Eğitim setini bir kez satın alırsın, ömür boyu senindir. Abonelikte ise tüm " +
      "eğitimlere ve yazılımlara aynı anda erişirsin, yeni çıkan içerikler otomatik " +
      "olarak hesabına tanımlanır. Aboneliği istediğin zaman iptal edebilirsin.",
  },
  {
    soru: "Yapay zekâ araçlarını kullanmayı bilmiyorum, sorun olur mu?",
    cevap:
      "Hayır. Kullandığım araçların tamamını ekran kaydıyla, tıklama tıklama " +
      "gösteriyorum. Ayrıca kendi geliştirdiğim yazılımlar işin teknik kısmını " +
      "senin yerine hallediyor.",
  },
  {
    soru: "Kazanç garantisi veriyor musun?",
    cevap:
      "Hayır, veremem — kimse veremez. Sana çalışan bir sistemi, gerçek verilerle " +
      "ve kendi kanallarımdan örneklerle gösteriyorum. Sonuç; harcadığın emeğe, " +
      "seçtiğin konuya ve düzenli üretimine bağlı.",
  },
  {
    soru: "Ödeme nasıl yapılıyor, güvenli mi?",
    cevap:
      "Ödemeler PayTR altyapısı üzerinden, 3D Secure doğrulamasıyla alınır. " +
      "Kart bilgilerin bize hiçbir zaman ulaşmaz, doğrudan bankanın sisteminde işlenir.",
  },
];

export default function AnaSayfa() {
  return (
    <>
      <JsonLd />

      {/* ─────────── Kahraman bölümü ─────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(820px_460px_at_76%_12%,rgba(255,197,61,0.13),transparent_62%),radial-gradient(620px_420px_at_4%_88%,rgba(14,165,233,0.09),transparent_62%)]"
        />
        <div className="kapsayici relative grid items-center gap-12 py-16 lg:grid-cols-[1.06fr_0.94fr] lg:py-20">
          <div className="animate-yukari">
            <Rozet className="mb-6">
              <Search size={13} /> 1.000.000+ aboneli kanalın sahibi
            </Rozet>

            <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
              Sosyal medyada para kazanmanın{" "}
              <span className="altin-yazi">izini sürüyoruz.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-metin2 sm:text-[17px]">
              Yapay zekâ destekli içerik üretimi, kanal büyütme ve gelir modelleri.
              Teoriden değil —{" "}
              <strong className="font-semibold text-metin">
                bizzat yönettiğim kanallardan
              </strong>{" "}
              öğren.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButonLink href="/abonelik">
                Aboneliği Başlat — {kurusTL(fiyatlar.abonelikAylikKurus)}/ay
              </ButonLink>
              <ButonLink href="/egitimler" tur="ikincil">
                Eğitimleri İncele
              </ButonLink>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-metin3">
              <ShieldCheck size={14} className="text-basari" />
              Kredi kartına taksit imkânı · İstediğin zaman iptal · 3D Secure ile güvenli ödeme
            </p>
          </div>

          <div className="relative flex items-end justify-center">
            <div
              aria-hidden
              className="absolute h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(255,197,61,0.2),transparent_66%)]"
            />
            <Image
              src="/gorseller/orhan-hero-kesim.webp"
              alt="Orhan Tümerkan — Dedektif Orhan"
              width={1551}
              height={1080}
              priority
              sizes="(max-width: 1024px) 90vw, 520px"
              className="relative z-10 max-h-[440px] w-auto object-contain drop-shadow-[0_28px_50px_rgba(0,0,0,0.65)]"
            />
          </div>
        </div>
      </section>

      {/* ─────────── Rakam şeridi ─────────── */}
      <section className="border-y border-gece-700 bg-gece-900">
        <div className="kapsayici grid grid-cols-2 lg:grid-cols-4">
          {rakamlar.map((r, i) => (
            <div
              key={r.etiket}
              className={`px-4 py-8 text-center ${
                i < rakamlar.length - 1 ? "lg:border-r lg:border-gece-700" : ""
              } ${i % 2 === 0 ? "border-r border-gece-700 lg:border-r" : ""} ${
                i < 2 ? "border-b border-gece-700 lg:border-b-0" : ""
              }`}
            >
              <b className="block font-baslik text-2xl font-extrabold text-altin-400 sm:text-3xl">
                {r.deger}
              </b>
              <span className="mt-2 block text-[13px] text-metin2">{r.etiket}</span>
              <i className="mt-1 block text-[11px] not-italic text-metin3">{r.kaynak}</i>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── Hizmetler ─────────── */}
      <section className="kapsayici py-20">
        <BolumBasligi
          ustBaslik="Hizmetler"
          baslik="Nereden başlamak istersin?"
          aciklama="Kendi hızında öğren, her şeye eriş ya da doğrudan benimle çalış."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <HizmetKarti
            ikon={<GraduationCap size={22} className="text-altin-400" />}
            baslik="Eğitim Setleri"
            aciklama="Tek konuya odaklanan, baştan sona yapılandırılmış video eğitimler. Bir kez satın al, ömür boyu eriş."
            fiyat="₺1.500"
            fiyatNot="'den başlayan"
            maddeler={["Ömür boyu erişim", "Güncellemeler ücretsiz", "Kaynak dosyalar dahil"]}
            butonAd="Eğitimleri Gör"
            butonHref="/egitimler"
          />
          <HizmetKarti
            oneCikan
            ikon={<Star size={22} className="text-altin-400" />}
            baslik="Aylık Abonelik"
            aciklama="Tüm eğitimler, tüm yazılımlar ve her yeni içerik. Tek ödemeyle her şeye eriş."
            fiyat={kurusTL(fiyatlar.abonelikAylikKurus)}
            fiyatNot="/ ay"
            maddeler={[
              "Tüm eğitim setleri dahil",
              "Tüm yazılımlar dahil",
              "Yeni içerikler otomatik",
              "İstediğin zaman iptal",
            ]}
            butonAd="Aboneliği Başlat"
            butonHref="/abonelik"
          />
          <HizmetKarti
            ikon={<Target size={22} className="text-altin-400" />}
            baslik="Birebir Danışmanlık"
            aciklama="Kanalını birlikte inceleyelim, sana özel yol haritası çıkaralım. Doğrudan benimle, canlı görüşme."
            fiyat={kurusTL(fiyatlar.danismanlikSaatlikKurus)}
            fiyatNot="/ saat"
            maddeler={[
              "Kanalına özel analiz",
              "Uygulanabilir yol haritası",
              "Görüşme kaydı sende kalır",
            ]}
            butonAd="Randevu Talep Et"
            butonHref="/danismanlik"
          />
        </div>
      </section>

      {/* ─────────── Kanıt ─────────── */}
      <section className="kapsayici pb-20">
        <BolumBasligi
          ustBaslik="Kanıt"
          baslik="Anlattıklarım kendi panellerimden"
          aciklama="Aşağıdakiler yönettiğim kanalların gerçek ekran görüntüleridir."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kanitlar.map((k) => (
            <figure
              key={k.baslik}
              className="overflow-hidden rounded-2xl border border-gece-700 bg-gece-850 transition-colors hover:border-altin-600"
            >
              {/* Sabit en-boy oranı: kaynak görseller farklı ölçülerde,
                  kutu sabit olmazsa ızgara dağılıyor. */}
              <div className="grid aspect-[16/10] place-items-center overflow-hidden border-b border-gece-700 bg-gece-900 p-3">
                <Image
                  src={k.gorsel}
                  alt={`${k.baslik} — ${k.aciklama}`}
                  width={900}
                  height={562}
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
                  className="max-h-full w-auto object-contain"
                />
              </div>
              <figcaption className="p-4">
                <b className="block font-baslik text-[15px] font-bold">{k.baslik}</b>
                <span className="mt-1 block text-xs text-metin3">{k.aciklama}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-6 rounded-xl border border-gece-700 bg-gece-900 px-5 py-4 text-center text-xs leading-relaxed text-metin3">
          Bu görseller geçmiş performansı gösterir; kazanç garantisi değildir.
          Sonuçlar kişiye, içeriğe ve harcanan emeğe göre değişir.
        </p>
      </section>

      {/* ─────────── Danışmanlık bandı ─────────── */}
      <section className="kapsayici pb-20">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-gece-700 bg-gradient-to-br from-gece-850 to-gece-800 p-8 lg:grid-cols-[1fr_0.8fr] lg:p-12">
          <div>
            <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
              Kanalını birlikte masaya yatıralım
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-metin2">
              60 dakikada kanalını baştan sona inceliyoruz: içerik stratejisi, algoritma,
              gelir modeli ve büyüme planı. Görüşme sonunda uygulanabilir bir yol haritan
              oluyor.
            </p>
            <div className="mt-7">
              <ButonLink href="/danismanlik">
                Randevu Talep Et — {kurusTL(fiyatlar.danismanlikSaatlikKurus)}/saat
              </ButonLink>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/gorseller/orhan-takim-elbise.webp"
              alt="Orhan Tümerkan"
              width={1400}
              height={1163}
              sizes="(max-width: 1024px) 70vw, 380px"
              className="max-h-[290px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </section>

      {/* ─────────── Sık sorulanlar ─────────── */}
      <section id="sss" className="kapsayici pb-24">
        <BolumBasligi ustBaslik="Sıkça Sorulanlar" baslik="Merak edilenler" />

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-gece-700 overflow-hidden rounded-2xl border border-gece-700 bg-gece-850">
          {sss.map((s) => (
            <details key={s.soru} className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-baslik text-[15px] font-semibold marker:content-none">
                {s.soru}
                <span className="shrink-0 text-xl leading-none text-altin-400 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-metin2">{s.cevap}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

function HizmetKarti({
  ikon,
  baslik,
  aciklama,
  fiyat,
  fiyatNot,
  maddeler,
  butonAd,
  butonHref,
  oneCikan = false,
}: {
  ikon: React.ReactNode;
  baslik: string;
  aciklama: string;
  fiyat: string;
  fiyatNot: string;
  maddeler: string[];
  butonAd: string;
  butonHref: string;
  oneCikan?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-gece-850 p-7 ${
        oneCikan ? "border-altin-500/40" : "border-gece-700"
      }`}
    >
      {oneCikan && (
        <span className="absolute -top-3 left-7 rounded-full bg-altin-400 px-3 py-1.5 text-[10px] font-bold tracking-widest text-gece-950">
          EN ÇOK TERCİH EDİLEN
        </span>
      )}

      <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-altin-500/10">
        {ikon}
      </div>

      <h3 className="text-lg font-bold">{baslik}</h3>
      <p className="mb-5 mt-2 flex-1 text-sm leading-relaxed text-metin2">{aciklama}</p>

      <div className="mb-5 flex items-baseline gap-2">
        <b className="font-baslik text-3xl font-extrabold">{fiyat}</b>
        <span className="text-[13px] text-metin3">{fiyatNot}</span>
      </div>

      <ul className="mb-6 grid gap-2.5">
        {maddeler.map((m) => (
          <li key={m} className="flex items-start gap-2.5 text-[13px] text-metin2">
            <span className="font-bold text-altin-400">✓</span>
            {m}
          </li>
        ))}
      </ul>

      <ButonLink href={butonHref} tur={oneCikan ? "birincil" : "ikincil"}>
        {butonAd}
      </ButonLink>
    </div>
  );
}

/** Google'a "bu kim, ne satıyor" bilgisini makine diliyle anlatır. */
function JsonLd() {
  const veri = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}/#kisi`,
        name: site.tamAd,
        alternateName: site.ad,
        jobTitle: site.unvan,
        url: site.url,
        sameAs: [site.sosyal.youtube, site.sosyal.instagram].filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#site`,
        url: site.url,
        name: site.ad,
        inLanguage: "tr-TR",
        publisher: { "@id": `${site.url}/#kisi` },
      },
      {
        "@type": "FAQPage",
        mainEntity: sss.map((s) => ({
          "@type": "Question",
          name: s.soru,
          acceptedAnswer: { "@type": "Answer", text: s.cevap },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(veri) }}
    />
  );
}
