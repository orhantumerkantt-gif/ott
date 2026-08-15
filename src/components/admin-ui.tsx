import Link from "next/link";
import type { ReactNode } from "react";

/* Yönetim panelinde tekrar eden parçalar. */

export function AdminBaslik({
  baslik,
  aciklama,
  eylem,
}: {
  baslik: string;
  aciklama?: string;
  eylem?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold">{baslik}</h1>
        {aciklama && <p className="mt-1.5 text-sm text-metin2">{aciklama}</p>}
      </div>
      {eylem}
    </header>
  );
}

export function IstatistikKarti({
  etiket,
  deger,
  alt,
  href,
  vurgu = false,
}: {
  etiket: string;
  deger: string;
  alt?: string;
  href?: string;
  vurgu?: boolean;
}) {
  const govde = (
    <div
      className={`rounded-2xl border bg-gece-850 p-5 transition-colors ${
        vurgu ? "border-altin-500/40" : "border-gece-700"
      } ${href ? "hover:border-altin-600" : ""}`}
    >
      <p className="text-xs font-medium text-metin3">{etiket}</p>
      <b
        className={`mt-2 block font-baslik text-2xl font-extrabold ${
          vurgu ? "text-altin-400" : "text-metin"
        }`}
      >
        {deger}
      </b>
      {alt && <p className="mt-1 text-xs text-metin3">{alt}</p>}
    </div>
  );

  return href ? <Link href={href}>{govde}</Link> : govde;
}

export function Tablo({
  basliklar,
  children,
  bosMesaj = "Kayıt bulunmuyor.",
  bosMu = false,
}: {
  basliklar: string[];
  children: ReactNode;
  bosMesaj?: string;
  bosMu?: boolean;
}) {
  if (bosMu) {
    return (
      <div className="rounded-2xl border border-dashed border-gece-600 bg-gece-900 p-10 text-center text-sm text-metin3">
        {bosMesaj}
      </div>
    );
  }

  return (
    // Dar ekranda tablo taşmasın diye KENDİ kutusunda kayar;
    // sayfa gövdesi asla yatay kaymaz.
    <div className="overflow-x-auto rounded-2xl border border-gece-700">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead className="bg-gece-900">
          <tr>
            {basliklar.map((b) => (
              <th
                key={b}
                className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-metin3"
              >
                {b}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gece-700 bg-gece-850">{children}</tbody>
      </table>
    </div>
  );
}

export function DurumRozeti({ durum }: { durum: string }) {
  const stiller: Record<string, string> = {
    ODENDI: "bg-basari/15 text-basari",
    AKTIF: "bg-basari/15 text-basari",
    ONAYLANDI: "bg-basari/15 text-basari",
    TAMAMLANDI: "bg-basari/15 text-basari",
    BEKLIYOR: "bg-uyari/15 text-uyari",
    TALEP: "bg-uyari/15 text-uyari",
    BASARISIZ: "bg-hata/15 text-hata",
    IPTAL: "bg-hata/15 text-hata",
    IADE: "bg-iz-500/15 text-iz-300",
    SURESI_DOLDU: "bg-gece-700 text-metin3",
  };

  const etiketler: Record<string, string> = {
    ODENDI: "Ödendi",
    BEKLIYOR: "Bekliyor",
    BASARISIZ: "Başarısız",
    IADE: "İade",
    AKTIF: "Aktif",
    IPTAL: "İptal",
    SURESI_DOLDU: "Süresi doldu",
    TALEP: "Talep",
    ONAYLANDI: "Onaylandı",
    TAMAMLANDI: "Tamamlandı",
  };

  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        stiller[durum] ?? "bg-gece-700 text-metin2"
      }`}
    >
      {etiketler[durum] ?? durum}
    </span>
  );
}

export const tarihBicimi = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const tarihSaatBicimi = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
