import type { Metadata } from "next";
import Image from "next/image";
import { site, fiyatlar, kurusTL } from "@/lib/site";
import { BolumBasligi, ButonLink, Rozet } from "@/components/ui";

export const metadata: Metadata = {
  title: "Hakkımda",
  description:
    "Orhan Tümerkan — 2012'den beri YouTube'da içerik üretiyorum. 10 milyardan fazla " +
    "izlenme, 90'dan fazla YouTube ödül plaketi.",
  alternates: { canonical: "/hakkimda" },
};

const kilometreTaslari = [
  { yil: "2012", olay: "İlk YouTube kanalımı açtım. Hiçbir şey bilmiyordum." },
  { yil: "2018", olay: "İlk 100.000 abone ve ilk gümüş plaket." },
  { yil: "2021", olay: "Kanal ağını büyütmeye başladım, ekip kurdum." },
  { yil: "2023", olay: "Tek kanalda 1.000.000 abone ve altın plaket." },
  { yil: "2024", olay: "Üretimi yapay zekâ ile otomatikleştiren yazılımlarımı geliştirdim." },
  { yil: "2026", olay: "Bilgi ve araçlarımı eğitim olarak paylaşmaya başladım." },
];

export default function HakkimdaSayfasi() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(760px_420px_at_20%_10%,rgba(255,197,61,0.11),transparent_62%)]"
        />
        <div className="kapsayici relative grid items-center gap-12 py-16 lg:grid-cols-2">
          <div>
            <Rozet className="mb-6">2012'den beri içerik üretiyorum</Rozet>
            <h1 className="text-4xl font-extrabold leading-[1.08] sm:text-5xl">
              Ben <span className="altin-yazi">Orhan Tümerkan</span>
            </h1>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-metin2">
              <p>
                2012'de, ne yaptığımı bilmeden bir YouTube kanalı açtım. İlk yıllar
                denemeyle geçti — çoğu video izlenmedi, çoğu fikir tutmadı.
              </p>
              <p>
                Sonra bir şeyi fark ettim: bu iş şans işi değil,{" "}
                <strong className="text-metin">çözülebilir bir bulmaca</strong>. Neyin
                işe yaradığını veriye bakarak bulmaya başladım. İz sürmek diyorum buna —
                lakabım da oradan geliyor.
              </p>
              <p>
                Bugün yönettiğim kanallarda <strong className="text-metin">10 milyardan
                fazla izlenme</strong> ve <strong className="text-metin">90'dan fazla
                YouTube ödül plaketi</strong> var: 10 altın, 80 gümüş.
              </p>
              <p>
                Artık aynı sistemi öğretiyorum. Teoriden değil — hâlâ her gün kendi
                kanallarımda uyguladığım, çalıştığını bildiğim yöntemlerden.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src="/gorseller/orhan-plaketler-1.webp"
              alt="Orhan Tümerkan YouTube plaketleriyle"
              width={1500}
              height={2000}
              priority
              sizes="(max-width: 1024px) 85vw, 440px"
              className="max-h-[500px] w-auto rounded-2xl border border-gece-700 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Rakamlar */}
      <section className="border-y border-gece-700 bg-gece-900">
        <div className="kapsayici grid grid-cols-2 lg:grid-cols-4">
          {site.rakamlar.map((r, i) => (
            <div
              key={r.etiket}
              className={`px-4 py-8 text-center ${
                i % 2 === 0 ? "border-r border-gece-700" : ""
              } ${i < 2 ? "border-b border-gece-700 lg:border-b-0" : ""} ${
                i < 3 ? "lg:border-r lg:border-gece-700" : ""
              }`}
            >
              <b className="block font-baslik text-2xl font-extrabold text-altin-400 sm:text-3xl">
                {r.deger}
              </b>
              <span className="mt-2 block text-[13px] text-metin2">{r.etiket}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Yolculuk */}
      <section className="kapsayici py-16">
        <BolumBasligi ustBaslik="Yolculuk" baslik="Nereden nereye" />

        <ol className="mx-auto mt-12 max-w-2xl">
          {kilometreTaslari.map((k, i) => (
            <li key={k.yil} className="relative flex gap-6 pb-8 last:pb-0">
              {/* Dikey çizgi: son öğede çizilmez */}
              {i < kilometreTaslari.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[27px] top-14 h-[calc(100%-3rem)] w-px bg-gece-700"
                />
              )}
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-altin-500/30 bg-altin-500/10 font-baslik text-sm font-bold text-altin-400">
                {k.yil}
              </span>
              <p className="pt-4 text-[15px] leading-relaxed text-metin2">{k.olay}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Plaket galerisi */}
      <section className="kapsayici pb-16">
        <BolumBasligi
          ustBaslik="Ödüller"
          baslik="90+ YouTube plaketi"
          aciklama="10 altın, 80 gümüş. Her biri bir kanalın belirli bir abone eşiğini geçtiğini gösteriyor."
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {["plaket-vitrini-2", "plaket-vitrini-1"].map((g) => (
            <Image
              key={g}
              src={`/gorseller/${g}.webp`}
              alt="YouTube ödül plaketleri"
              width={1500}
              height={2378}
              sizes="(max-width: 640px) 90vw, 420px"
              className="w-full rounded-2xl border border-gece-700 object-cover"
            />
          ))}
        </div>
      </section>

      <section className="kapsayici pb-20">
        <div className="rounded-3xl border border-gece-700 bg-gradient-to-br from-gece-850 to-gece-800 p-8 text-center lg:p-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Aynı yolu senin için kısaltalım
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-metin2">
            14 yılda öğrendiklerimi sıfırdan keşfetmene gerek yok.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButonLink href="/abonelik">
              Aboneliği Başlat — {kurusTL(fiyatlar.abonelikAylikKurus)}/ay
            </ButonLink>
            <ButonLink href="/danismanlik" tur="ikincil">
              Birebir Danışmanlık
            </ButonLink>
          </div>
        </div>
      </section>
    </>
  );
}
