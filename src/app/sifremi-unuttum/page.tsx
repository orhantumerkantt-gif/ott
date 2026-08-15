import type { Metadata } from "next";
import Link from "next/link";
import { SifremiUnuttumFormu } from "./form";
import { Logo } from "@/components/marka/logo";

export const metadata: Metadata = {
  title: "Şifremi Unuttum",
  description: "Şifreni sıfırlamak için e-posta adresini gir.",
  robots: { index: false, follow: false },
};

export default function SifremiUnuttumSayfasi() {
  return (
    <section className="kapsayici flex max-w-md flex-col py-20">
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>

      <div className="rounded-2xl border border-gece-700 bg-gece-850 p-6 sm:p-8">
        <h1 className="font-baslik text-xl font-bold">Şifremi unuttum</h1>
        <p className="mb-6 mt-1 text-sm text-metin2">
          Kayıtlı e-posta adresini yaz, sıfırlama bağlantısını gönderelim.
        </p>

        <SifremiUnuttumFormu />

        <p className="mt-6 text-center text-sm text-metin2">
          <Link href="/giris" className="text-altin-400 hover:underline">
            Giriş sayfasına dön
          </Link>
        </p>
      </div>
    </section>
  );
}
