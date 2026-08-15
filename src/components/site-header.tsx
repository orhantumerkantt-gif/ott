"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard, LogIn } from "lucide-react";
import { Logo } from "@/components/marka/logo";
import { menu } from "@/lib/site";
import { ButonLink } from "@/components/ui";

export function SiteHeader({ girisliMi, adminMi }: { girisliMi: boolean; adminMi: boolean }) {
  const [acik, setAcik] = useState(false);
  const [kaydirildi, setKaydirildi] = useState(false);
  const yol = usePathname();

  // Sayfa değişince mobil menü açık kalmasın
  useEffect(() => setAcik(false), [yol]);

  useEffect(() => {
    const f = () => setKaydirildi(window.scrollY > 8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  // Menü açıkken arka plan kaymasın
  useEffect(() => {
    document.body.style.overflow = acik ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [acik]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        kaydirildi || acik
          ? "border-b border-gece-700 bg-gece-950/92 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="kapsayici flex h-[72px] items-center justify-between gap-4">
        <Link href="/" aria-label="Ana sayfa">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
          {menu.map((m) => {
            const aktif = m.href === "/" ? yol === "/" : yol.startsWith(m.href);
            return (
              <Link
                key={m.href}
                href={m.href}
                aria-current={aktif ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  aktif ? "text-altin-400" : "text-metin2 hover:bg-gece-800 hover:text-metin"
                }`}
              >
                {m.ad}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {girisliMi ? (
            <>
              {adminMi && (
                <ButonLink href="/admin" tur="hayalet">
                  Yönetim
                </ButonLink>
              )}
              <ButonLink href="/panel" tur="birincil">
                <LayoutDashboard size={16} /> Panelim
              </ButonLink>
            </>
          ) : (
            <>
              <ButonLink href="/giris" tur="hayalet">
                <LogIn size={16} /> Giriş
              </ButonLink>
              <ButonLink href="/kayit" tur="birincil">
                Ücretsiz Kayıt Ol
              </ButonLink>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setAcik((v) => !v)}
          className="rounded-lg p-2 text-metin lg:hidden"
          aria-label={acik ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={acik}
        >
          {acik ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {acik && (
        <div className="border-t border-gece-700 bg-gece-950 lg:hidden">
          <nav className="kapsayici flex flex-col gap-1 py-4" aria-label="Mobil menü">
            {menu.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-metin2 hover:bg-gece-800 hover:text-metin"
              >
                {m.ad}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-gece-700 pt-4">
              {girisliMi ? (
                <>
                  {adminMi && (
                    <ButonLink href="/admin" tur="ikincil">
                      Yönetim Paneli
                    </ButonLink>
                  )}
                  <ButonLink href="/panel">Panelim</ButonLink>
                </>
              ) : (
                <>
                  <ButonLink href="/giris" tur="ikincil">
                    Giriş Yap
                  </ButonLink>
                  <ButonLink href="/kayit">Ücretsiz Kayıt Ol</ButonLink>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
