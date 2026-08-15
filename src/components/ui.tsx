import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/* Tekrar eden arayüz parçaları. Sayfalarda satır içi stil yazmak yerine
   buradaki bileşenler kullanılır — görünüm tek yerden değişsin. */

type ButonTur = "birincil" | "ikincil" | "hayalet";

const butonStil: Record<ButonTur, string> = {
  birincil:
    "bg-altin-400 text-gece-950 hover:bg-altin-300 shadow-[0_8px_30px_-10px] shadow-altin-500/60",
  ikincil: "bg-gece-700 text-metin hover:bg-gece-600 border border-gece-600",
  hayalet: "text-metin2 hover:text-metin hover:bg-gece-800",
};

const temelButon =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none";

export function Buton({
  tur = "birincil",
  className = "",
  ...props
}: ComponentProps<"button"> & { tur?: ButonTur }) {
  return <button className={`${temelButon} ${butonStil[tur]} ${className}`} {...props} />;
}

export function ButonLink({
  tur = "birincil",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { tur?: ButonTur }) {
  return <Link className={`${temelButon} ${butonStil[tur]} ${className}`} {...props} />;
}

export function Rozet({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-altin-500/30 bg-altin-500/10 px-3 py-1 text-xs font-semibold text-altin-300 ${className}`}
    >
      {children}
    </span>
  );
}

export function BolumBasligi({
  ustBaslik,
  baslik,
  aciklama,
  ortala = true,
}: {
  ustBaslik?: string;
  baslik: string;
  aciklama?: string;
  ortala?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${ortala ? "mx-auto text-center" : ""}`}>
      {ustBaslik && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-altin-400">
          {ustBaslik}
        </p>
      )}
      <h2 className="text-3xl font-extrabold sm:text-4xl">{baslik}</h2>
      {aciklama && <p className="mt-4 text-base leading-relaxed text-metin2">{aciklama}</p>}
    </div>
  );
}

export function Uyari({
  tur = "bilgi",
  children,
}: {
  tur?: "bilgi" | "basari" | "hata";
  children: ReactNode;
}) {
  const stil = {
    bilgi: "border-iz-500/30 bg-iz-500/10 text-iz-300",
    basari: "border-basari/30 bg-basari/10 text-basari",
    hata: "border-hata/30 bg-hata/10 text-hata",
  }[tur];
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${stil}`} role="alert">
      {children}
    </div>
  );
}

export function Alan({
  etiket,
  ipucu,
  hata,
  children,
}: {
  etiket: string;
  ipucu?: string;
  hata?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-metin">{etiket}</span>
      {children}
      {ipucu && !hata && <span className="mt-1 block text-xs text-metin3">{ipucu}</span>}
      {hata && <span className="mt-1 block text-xs text-hata">{hata}</span>}
    </label>
  );
}

export const girdiStil =
  "w-full rounded-xl border border-gece-600 bg-gece-900 px-4 py-3 text-sm text-metin placeholder:text-metin3 focus:border-altin-400 focus:outline-none";
