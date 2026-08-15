import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { oturumVarsa } from "@/lib/yetki";
import { GirisFormu } from "./form";
import { Logo } from "@/components/marka/logo";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "Hesabına giriş yap, eğitimlerine ve yazılımlarına eriş.",
  alternates: { canonical: "/giris" },
  robots: { index: false, follow: true },
};

export default async function GirisSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ devam?: string }>;
}) {
  if (await oturumVarsa()) redirect("/panel");
  const { devam } = await searchParams;

  return (
    <section className="kapsayici flex max-w-md flex-col items-stretch py-20">
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>

      <div className="rounded-2xl border border-gece-700 bg-gece-850 p-6 sm:p-8">
        <h1 className="font-baslik text-xl font-bold">Giriş yap</h1>
        <p className="mb-6 mt-1 text-sm text-metin2">
          Hesabın yok mu?{" "}
          <Link href="/kayit" className="font-semibold text-altin-400 hover:underline">
            Ücretsiz kayıt ol
          </Link>
        </p>

        <GirisFormu devam={devam} />
      </div>
    </section>
  );
}
