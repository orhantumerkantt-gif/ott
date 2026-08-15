import Link from "next/link";
import { ArrowLeft, FileText, ShieldCheck, Info } from "lucide-react";
import { kurusTL } from "@/lib/site";

/**
 * Sözleşme metinlerinin sürümü. Metinler değişince BURASI da değişmeli —
 * hangi müşterinin hangi sürümü onayladığı siparişte saklanır
 * (Order.sozlesmeSurum). Bir uyuşmazlıkta "o gün ne yazıyordu" sorusunun
 * cevabı budur.
 */
export const SOZLESME_SURUM = "2026-08-16";

/**
 * Ödeme öncesi onay ekranı.
 *
 * ★ NEDEN VAR: "dijital üründe iade yoktur" maddesi kendiliğinden geçerli
 *   DEĞİLDİR. Mesafeli Sözleşmeler Yönetmeliği m.15, cayma hakkının
 *   kullanılamaması için tüketicinin bunu ödemeden ÖNCE açıkça kabul
 *   etmesini arar. Bu ekran o kabulü alır; alınmazsa sipariş bile
 *   oluşturulmaz ve ödeme başlatılmaz.
 *
 * ★ JavaScript GEREKTİRMEZ: kutucuklar `required`, form düz GET.
 *   Tarayıcı boş kutuyla göndermeyi kendisi engeller. Ödeme yolundaki
 *   en kritik kapı, istemci betiğine bağlı olmamalı.
 */
export function OdemeOnay({
  urunAdi,
  tutarKurus,
  tur,
  geriYol,
}: {
  urunAdi: string;
  tutarKurus: number;
  tur: string;
  geriYol: string;
}) {
  const abonelikMi = tur === "ABONELIK";

  return (
    <section className="kapsayici max-w-2xl py-10">
      <Link
        href={geriYol}
        className="inline-flex items-center gap-2 text-sm text-metin2 hover:text-altin-400"
      >
        <ArrowLeft size={15} /> Vazgeç
      </Link>

      <div className="mt-6 rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <h1 className="font-baslik text-lg font-bold">Siparişini onayla</h1>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gece-700 bg-gece-900 px-4 py-3">
          <span className="text-sm text-metin2">{urunAdi}</span>
          <b className="font-baslik text-xl font-extrabold">
            {kurusTL(tutarKurus)}
            {abonelikMi && (
              <span className="ml-1 text-xs font-normal text-metin3">/ ay</span>
            )}
          </b>
        </div>

        <div className="mt-5 flex gap-3 rounded-xl border border-uyari/30 bg-uyari/10 p-4 text-sm text-uyari">
          <Info size={18} className="mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            {abonelikMi ? (
              <>
                Abonelik <strong>her ay otomatik yenilenir</strong>. İstediğin zaman
                iptal edebilirsin; ödediğin dönemin sonuna kadar erişimin devam eder.
                Başlamış bir dönem için iade yapılmaz.
              </>
            ) : (
              <>
                Bu bir dijital üründür. Ödeme onaylandığı anda erişimin açılır ve
                teslim tamamlanmış sayılır —{" "}
                <strong>satın aldıktan sonra iade veya geri ödeme yapılmaz.</strong>
              </>
            )}
          </p>
        </div>

        <form method="get" className="mt-6 grid gap-4">
          <input type="hidden" name="onay" value="1" />

          <label className="flex cursor-pointer gap-3 rounded-xl border border-gece-700 bg-gece-900 p-4 text-sm leading-relaxed text-metin2 transition-colors hover:border-gece-600">
            <input
              type="checkbox"
              name="sozlesme"
              required
              className="mt-0.5 size-4 shrink-0 accent-altin-400"
            />
            <span>
              <Link
                href="/yasal/on-bilgilendirme-formu"
                target="_blank"
                className="text-altin-400 hover:underline"
              >
                Ön Bilgilendirme Formu
              </Link>
              &apos;nu ve{" "}
              <Link
                href="/yasal/mesafeli-satis-sozlesmesi"
                target="_blank"
                className="text-altin-400 hover:underline"
              >
                Mesafeli Satış Sözleşmesi
              </Link>
              &apos;ni okudum, kabul ediyorum.
            </span>
          </label>

          <label className="flex cursor-pointer gap-3 rounded-xl border border-gece-700 bg-gece-900 p-4 text-sm leading-relaxed text-metin2 transition-colors hover:border-gece-600">
            <input
              type="checkbox"
              name="cayma"
              required
              className="mt-0.5 size-4 shrink-0 accent-altin-400"
            />
            <span>
              Dijital içeriğin <strong>ödeme onaylandığı anda teslim edildiğini</strong>,
              bu nedenle cayma hakkımın bulunmadığını ve{" "}
              <strong>iade talep edemeyeceğimi</strong> kabul ediyorum.{" "}
              <Link
                href="/yasal/iade-politikasi"
                target="_blank"
                className="text-altin-400 hover:underline"
              >
                İptal ve İade Politikası
              </Link>
            </span>
          </label>

          <button
            type="submit"
            className="mt-1 w-full rounded-xl bg-altin-400 px-6 py-3.5 font-baslik font-bold text-gece-950 transition-colors hover:bg-altin-300"
          >
            Onaylıyorum, ödemeye geç →
          </button>
        </form>

        <div className="mt-5 grid gap-2 text-xs text-metin3">
          <p className="flex items-center gap-2">
            <ShieldCheck size={13} className="text-basari" />
            Kart bilgilerin bu siteye ulaşmaz; doğrudan PayTR ve bankan arasında
            işlenir.
          </p>
          <p className="flex items-center gap-2">
            <FileText size={13} />
            Onayın, tarihiyle birlikte sipariş kaydına işlenir.
          </p>
        </div>
      </div>
    </section>
  );
}
