/**
 * Dedektif Orhan marka işareti.
 *
 * Fikir: bir büyüteç merceği + içinde parmak izi kıvrımları. "İz sürmek"
 * markanın ana metaforu; kartal maskotu yerine bunu seçtik çünkü hem
 * dedektif kimliğini hem de "veriye bakıp analiz etmeyi" anlatıyor.
 *
 * Tek renkli zeminlerde de bozulmasın diye gradyan `id` çakışmasını
 * önlemek üzere benzersiz ek alır.
 */

/**
 * Gradyan id'si BİLEREK sabit.
 *
 * Önce artan bir sayaçla benzersizleştiriliyordu; bu, sunucuda ve tarayıcıda
 * farklı sırayla çalıştığı için `id="lg2-a"` ↔ `id="lg3-a"` uyuşmazlığı
 * üretti ve React hydration hatası verdi.
 *
 * Benzersizliğe gerek yok: sayfadaki bütün logolar AYNI gradyanı kullanıyor,
 * id çakışsa bile tarayıcı hepsine aynı tanımı uyguluyor — görsel fark yok.
 */
const GRADYAN_ID = "dedektif-logo-gradyan";

export function LogoIsaret({ className = "h-10 w-10" }: { className?: string }) {
  const uid = GRADYAN_ID;
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Dedektif Orhan logosu">
      <defs>
        <linearGradient id={`${uid}-a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe9a8" />
          <stop offset="45%" stopColor="#ffc53d" />
          <stop offset="100%" stopColor="#c98a0e" />
        </linearGradient>
      </defs>

      {/* Mercek sapı */}
      <path
        d="M31.5 31.5 L41.5 41.5"
        stroke={`url(#${uid}-a)`}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      {/* Mercek halkası */}
      <circle cx="19.5" cy="19.5" r="14.5" fill="none" stroke={`url(#${uid}-a)`} strokeWidth="3.5" />
      {/* Mercek camı */}
      <circle cx="19.5" cy="19.5" r="12.8" fill="#0b1120" />

      {/* Parmak izi kıvrımları */}
      <g stroke={`url(#${uid}-a)`} strokeWidth="1.7" fill="none" strokeLinecap="round">
        <path d="M12.6 22.8a7.4 7.4 0 0 1 13.8-4.6" />
        <path d="M15.4 25.2a4.7 4.7 0 0 1 8.4-3.9" />
        <path d="M18.4 26.4a2 2 0 0 1 3-2.2" />
        <path d="M10.2 18.6a9.8 9.8 0 0 1 17.6-1.4" opacity="0.65" />
      </g>
    </svg>
  );
}

export function Logo({
  className = "",
  yaziGoster = true,
}: {
  className?: string;
  yaziGoster?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoIsaret className="h-9 w-9 shrink-0" />
      {yaziGoster && (
        <span className="leading-none">
          <span className="block font-baslik text-[15px] font-extrabold tracking-[0.16em] text-altin-400">
            DEDEKTİF
          </span>
          <span className="block font-baslik text-[19px] font-extrabold tracking-tight text-metin">
            ORHAN
          </span>
        </span>
      )}
    </span>
  );
}
