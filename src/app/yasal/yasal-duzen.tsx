import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { site, yasalMenu } from "@/lib/site";
import { oturumVarsa } from "@/lib/yetki";
import { ROL } from "@/lib/sabitler";

/**
 * Satıcı bilgilerinden eksik olanlar.
 * ★ Bu uyarı YALNIZCA yöneticiye gösterilir: müşteriye "bu metin henüz
 *   tamamlanmadı" yazan bir sözleşme sayfası, eksik alanın kendisinden
 *   daha çok güven kaybettirir. Orhan siteye kendi girdiğinde görür.
 */
function eksikSaticiBilgisi() {
  const s = site.saticiBilgileri;
  const eksikler: string[] = [];
  if (!s.adres) eksikler.push("adres");
  if (!s.telefon) eksikler.push("telefon");
  if (!s.vergiDairesi) eksikler.push("vergi dairesi");
  if (!s.vergiNo) eksikler.push("vergi/TC kimlik no");
  return eksikler;
}

export async function YasalDuzen({
  baslik,
  guncelleme,
  children,
}: {
  baslik: string;
  guncelleme: string;
  children: React.ReactNode;
}) {
  const kullanici = await oturumVarsa();
  const eksikler = kullanici?.rol === ROL.ADMIN ? eksikSaticiBilgisi() : [];

  return (
    <section className="kapsayici grid max-w-6xl gap-10 py-14 lg:grid-cols-[240px_1fr]">
      <nav aria-label="Yasal belgeler" className="lg:sticky lg:top-24 lg:self-start">
        <h2 className="mb-4 font-baslik text-sm font-bold text-metin">Yasal Belgeler</h2>
        <ul className="grid gap-1">
          {yasalMenu.map((y) => (
            <li key={y.href}>
              <Link
                href={y.href}
                className="block rounded-lg px-3 py-2 text-[13px] text-metin2 transition-colors hover:bg-gece-800 hover:text-metin"
              >
                {y.ad}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <article>
        <h1 className="text-3xl font-extrabold">{baslik}</h1>
        <p className="mt-2 text-sm text-metin3">Son güncelleme: {guncelleme}</p>

        {eksikler.length > 0 && (
          <div className="mt-6 flex gap-3 rounded-xl border border-uyari/30 bg-uyari/10 p-4 text-sm text-uyari">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              <strong>Yalnızca sen görüyorsun (yönetici notu).</strong>
              <p className="mt-1 leading-relaxed">
                Satıcı bilgilerinden şunlar eksik: <strong>{eksikler.join(", ")}</strong>.
                Bu alanlar{" "}
                <code className="rounded bg-gece-800 px-1.5 py-0.5 text-xs">
                  src/lib/site.ts
                </code>{" "}
                dosyasındaki <code className="text-xs">saticiBilgileri</code> bölümüne
                yazılmalıdır. Bir tüketici şikâyetinde mesafeli satış sözleşmesinin
                mevzuata uygunluğu bu bilgilerle değerlendirilir. Müşteriler bu
                kutuyu görmez.
              </p>
            </div>
          </div>
        )}

        <div className="prose prose-dedektif mt-8 max-w-none prose-headings:font-baslik prose-h2:text-xl prose-h3:text-base">
          {children}
        </div>
      </article>
    </section>
  );
}

/**
 * Yasal metinlerde tekrar eden satıcı bilgisi tablosu.
 * ★ Değeri boş olan satır tabloya HİÇ girmez — müşteriye yarım bir tablo
 *   göstermek yerine yalnızca doğrulanabilir bilgiler yayınlanır.
 */
export function SaticiTablosu() {
  const s = site.saticiBilgileri;
  const satirlar: [string, string][] = [
    ["Satıcı", s.unvan],
    ["Şirket türü", s.sirketTuru],
    ["Adres", s.adres],
    ["Telefon", s.telefon],
    ["E-posta", s.eposta],
    ["Vergi Dairesi", s.vergiDairesi],
    ["Vergi / TC Kimlik No", s.vergiNo],
    ["MERSİS No", s.mersisNo],
    ["İnternet Sitesi", site.url],
  ];

  return (
    <table>
      <tbody>
        {satirlar
          .filter(([, v]) => Boolean(v))
          .map(([k, v]) => (
            <tr key={k}>
              <th className="text-left">{k}</th>
              <td>{v}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
