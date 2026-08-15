import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Package,
  Star,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { db } from "@/lib/db";
import { oturumZorunlu, abonelikAktifMi } from "@/lib/yetki";
import { kurusTL, fiyatlar } from "@/lib/site";
import { ABONELIK_DURUM_ETIKET, SIPARIS_DURUM, ROL } from "@/lib/sabitler";
import { ButonLink, Rozet, Uyari } from "@/components/ui";
import { CikisButonu } from "@/components/cikis-butonu";

export const metadata: Metadata = {
  title: "Panelim",
  robots: { index: false, follow: false },
};

const tarihBicimi = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function PanelSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ hosgeldin?: string }>;
}) {
  const kullanici = await oturumZorunlu("/panel");
  const { hosgeldin } = await searchParams;

  const [abonelik, kayitlar, siparisler, aktifMi] = await Promise.all([
    db.subscription.findUnique({
      where: { userId: kullanici.id },
      include: { plan: true },
    }),
    db.enrollment.findMany({
      where: { userId: kullanici.id },
      include: { course: true },
      orderBy: { createdAt: "desc" },
    }),
    db.order.findMany({
      where: { userId: kullanici.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    abonelikAktifMi(kullanici.id),
  ]);

  // Abonelik aktifse abonelik kapsamındaki her eğitim erişilebilir sayılır
  const abonelikEgitimleri = aktifMi
    ? await db.course.findMany({
        where: { yayinda: true, abonelikDahil: true },
        orderBy: { sira: "asc" },
      })
    : [];

  const erisilebilirEgitimler = aktifMi
    ? abonelikEgitimleri
    : kayitlar.map((k) => k.course);

  const yazilimlar = aktifMi
    ? await db.software.findMany({
        where: { yayinda: true, abonelikDahil: true },
        orderBy: { sira: "asc" },
      })
    : [];

  return (
    <section className="kapsayici py-12">
      {hosgeldin && (
        <div className="mb-8">
          <Uyari tur="basari">
            <strong>Aramıza hoş geldin, {kullanici.name}!</strong> Hesabın hazır.
            Aşağıdan eğitimlere göz atabilir ya da aboneliği başlatabilirsin.
          </Uyari>
        </div>
      )}

      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-altin-400">
            Panelim
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">
            Merhaba, {kullanici.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-metin2">{kullanici.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {kullanici.rol === ROL.ADMIN && (
            <ButonLink href="/admin" tur="ikincil">
              Yönetim Paneli
            </ButonLink>
          )}
          <CikisButonu />
        </div>
      </header>

      {/* Abonelik durumu */}
      <div className="mb-8 rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-altin-500/10">
              <Star size={20} className="text-altin-400" />
            </div>
            <div>
              <h2 className="font-baslik text-base font-bold">Abonelik</h2>
              {aktifMi && abonelik ? (
                <p className="mt-1 text-sm text-metin2">
                  <span className="font-semibold text-basari">
                    {ABONELIK_DURUM_ETIKET[abonelik.durum]}
                  </span>
                  {abonelik.donemSonu && (
                    <> · Sonraki yenileme: {tarihBicimi.format(abonelik.donemSonu)}</>
                  )}
                </p>
              ) : (
                <p className="mt-1 text-sm text-metin2">
                  Aktif aboneliğin yok. Tüm eğitim ve yazılımlara erişmek için
                  aboneliği başlatabilirsin.
                </p>
              )}
            </div>
          </div>

          {!aktifMi && (
            <ButonLink href="/abonelik">
              Aboneliği Başlat — {kurusTL(fiyatlar.abonelikAylikKurus)}/ay
            </ButonLink>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Eğitimlerim */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 flex items-center gap-2 font-baslik text-lg font-bold">
            <GraduationCap size={19} className="text-altin-400" /> Eğitimlerim
          </h2>

          {erisilebilirEgitimler.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gece-600 bg-gece-900 p-8 text-center">
              <Sparkles size={26} className="mx-auto mb-3 text-metin3" />
              <p className="text-sm text-metin2">
                Henüz bir eğitime erişimin yok.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <ButonLink href="/egitimler" tur="ikincil">
                  Eğitimlere Göz At
                </ButonLink>
                <ButonLink href="/abonelik">Abonelikle Hepsine Eriş</ButonLink>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {erisilebilirEgitimler.map((e) => (
                <Link
                  key={e.id}
                  href={`/panel/egitimlerim/${e.slug}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-gece-700 bg-gece-850 p-4 transition-colors hover:border-altin-600"
                >
                  <div>
                    <h3 className="font-baslik text-[15px] font-semibold">{e.baslik}</h3>
                    {e.altBaslik && (
                      <p className="mt-0.5 text-xs text-metin3">{e.altBaslik}</p>
                    )}
                  </div>
                  <ArrowRight size={17} className="shrink-0 text-altin-400" />
                </Link>
              ))}
            </div>
          )}

          {/* Yazılımlarım */}
          {yazilimlar.length > 0 && (
            <>
              <h2 className="mb-4 mt-8 flex items-center gap-2 font-baslik text-lg font-bold">
                <Package size={19} className="text-altin-400" /> Yazılımlarım
              </h2>
              <div className="grid gap-3">
                {yazilimlar.map((y) => (
                  <div
                    key={y.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-gece-700 bg-gece-850 p-4"
                  >
                    <div>
                      <h3 className="font-baslik text-[15px] font-semibold">{y.ad}</h3>
                      <p className="mt-0.5 text-xs text-metin3">
                        Sürüm {y.surum} · {y.platform}
                      </p>
                    </div>
                    <ButonLink
                      href={`/panel/indir/${y.slug}`}
                      tur="ikincil"
                      className="shrink-0 px-4 py-2.5 text-[13px]"
                    >
                      İndir
                    </ButonLink>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Son siparişler */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-baslik text-lg font-bold">
            <ShoppingBag size={19} className="text-altin-400" /> Son siparişler
          </h2>

          {siparisler.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-gece-600 bg-gece-900 p-6 text-center text-sm text-metin3">
              Henüz siparişin yok.
            </p>
          ) : (
            <div className="grid gap-2.5">
              {siparisler.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-gece-700 bg-gece-850 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[13px] font-medium">{s.urunAdi}</span>
                    <b className="shrink-0 font-baslik text-sm">
                      {kurusTL(s.tutarKurus)}
                    </b>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs text-metin3">
                    <span>{tarihBicimi.format(s.createdAt)}</span>
                    <span
                      className={
                        s.durum === SIPARIS_DURUM.ODENDI ? "text-basari" : "text-uyari"
                      }
                    >
                      {s.durum === SIPARIS_DURUM.ODENDI ? "Ödendi" : "Bekliyor"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
