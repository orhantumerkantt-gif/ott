import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Uyari } from "@/components/ui";
import { Logo } from "@/components/marka/logo";
import { YeniSifreFormu } from "./form";

export const metadata: Metadata = {
  title: "Yeni Şifre Belirle",
  robots: { index: false, follow: false },
};

export default async function SifreSifirlaSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  // Token'ı formu göstermeden önce doğrula: kullanıcı yeni şifresini yazıp
  // gönderdikten sonra "bağlantı geçersiz" demek kötü bir deneyim.
  const gecerli = token
    ? Boolean(
        await db.user.findFirst({
          where: { sifreToken: token, sifreTokenSonu: { gt: new Date() } },
          select: { id: true },
        }),
      )
    : false;

  return (
    <section className="kapsayici flex max-w-md flex-col py-20">
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>

      <div className="rounded-2xl border border-gece-700 bg-gece-850 p-6 sm:p-8">
        <h1 className="font-baslik text-xl font-bold">Yeni şifre belirle</h1>

        {gecerli ? (
          <>
            <p className="mb-6 mt-1 text-sm text-metin2">
              Yeni şifreni iki kez yaz ve kaydet.
            </p>
            <YeniSifreFormu token={token!} />
          </>
        ) : (
          <div className="mt-4 grid gap-5">
            <Uyari tur="hata">
              Bu bağlantı geçersiz veya süresi dolmuş. Sıfırlama bağlantıları
              60 dakika geçerlidir.
            </Uyari>
            <Link
              href="/sifremi-unuttum"
              className="text-center text-sm font-semibold text-altin-400 hover:underline"
            >
              Yeni bağlantı iste
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
