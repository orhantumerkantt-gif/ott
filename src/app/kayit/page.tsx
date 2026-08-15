import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { oturumVarsa } from "@/lib/yetki";
import { KayitFormu } from "./form";
import { Logo } from "@/components/marka/logo";

export const metadata: Metadata = {
  title: "Ücretsiz Kayıt Ol",
  description:
    "Ücretsiz üye ol, eğitimlere ve yazılımlara erişmeye başla. Kayıt olmak ücretsizdir.",
  alternates: { canonical: "/kayit" },
  robots: { index: false, follow: true },
};

const faydalar = [
  "Ücretsiz önizleme derslerini izle",
  "Satın aldığın eğitimler tek panelde",
  "Yazılımları güvenli indirme bağlantısıyla al",
  "Abonelik ve sipariş geçmişini takip et",
];

export default async function KayitSayfasi() {
  // Zaten girişliyse kayıt formunu göstermenin anlamı yok
  if (await oturumVarsa()) redirect("/panel");

  return (
    <section className="kapsayici grid max-w-5xl items-center gap-12 py-16 lg:grid-cols-[1fr_1.1fr]">
      <div className="hidden lg:block">
        <Logo className="mb-8" />
        <h1 className="text-3xl font-extrabold leading-tight">
          Hesabını oluştur, <span className="altin-yazi">hemen başla</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-metin2">
          Kayıt olmak ücretsiz. Kredi kartı istemiyoruz.
        </p>
        <ul className="mt-8 grid gap-3">
          {faydalar.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-metin2">
              <Check size={17} className="mt-0.5 shrink-0 text-altin-400" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gece-700 bg-gece-850 p-6 sm:p-8">
        <h2 className="font-baslik text-xl font-bold lg:hidden">Ücretsiz Kayıt Ol</h2>
        <p className="mb-6 mt-1 text-sm text-metin2 lg:mt-0">
          Zaten hesabın var mı?{" "}
          <Link href="/giris" className="font-semibold text-altin-400 hover:underline">
            Giriş yap
          </Link>
        </p>
        <KayitFormu />
      </div>
    </section>
  );
}
