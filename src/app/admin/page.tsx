import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { db } from "@/lib/db";
import { kurusTL } from "@/lib/site";
import { SIPARIS_DURUM, ABONELIK_DURUM } from "@/lib/sabitler";
import {
  AdminBaslik,
  IstatistikKarti,
  Tablo,
  DurumRozeti,
  tarihSaatBicimi,
} from "@/components/admin-ui";
import { odemeTestModundaMi } from "@/lib/odeme";

export const metadata = { title: "Genel Bakış" };

export default async function AdminAnaSayfa() {
  const simdi = new Date();
  const ayBasi = new Date(simdi.getFullYear(), simdi.getMonth(), 1);

  const [
    uyeSayisi,
    aktifAbone,
    buAyOdenen,
    toplamOdenen,
    sonSiparisler,
    okunmamisMesaj,
    bekleyenRandevu,
    yayindaEgitim,
  ] = await Promise.all([
    db.user.count(),
    db.subscription.count({
      where: { durum: ABONELIK_DURUM.AKTIF, donemSonu: { gt: simdi } },
    }),
    db.order.aggregate({
      where: { durum: SIPARIS_DURUM.ODENDI, odendiAt: { gte: ayBasi } },
      _sum: { tutarKurus: true },
      _count: true,
    }),
    db.order.aggregate({
      where: { durum: SIPARIS_DURUM.ODENDI },
      _sum: { tutarKurus: true },
    }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    db.lead.count({ where: { okundu: false } }),
    db.booking.count({ where: { durum: "TALEP" } }),
    db.course.count({ where: { yayinda: true } }),
  ]);

  return (
    <>
      <AdminBaslik
        baslik="Genel Bakış"
        aciklama="Sitenin özet durumu. Rakamlar canlı veritabanından okunuyor."
      />

      {odemeTestModundaMi() && (
        <div className="mb-6 flex gap-3 rounded-xl border border-uyari/30 bg-uyari/10 p-4 text-sm text-uyari">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <strong>Ödeme sistemi test modunda.</strong>
            <p className="mt-1 leading-relaxed">
              Şu an gerçek tahsilat yapılmıyor. Site yayına alındığında ve PayTR
              panelinde Bildirim URL tanımlandığında canlı moda geçilecek.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <IstatistikKarti
          etiket="Bu ayki gelir"
          deger={kurusTL(buAyOdenen._sum.tutarKurus ?? 0)}
          alt={`${buAyOdenen._count} ödenmiş sipariş`}
          vurgu
        />
        <IstatistikKarti
          etiket="Aktif abone"
          deger={String(aktifAbone)}
          alt="Şu an erişimi açık"
          href="/admin/uyeler"
        />
        <IstatistikKarti
          etiket="Toplam üye"
          deger={String(uyeSayisi)}
          alt="Kayıtlı hesap"
          href="/admin/uyeler"
        />
        <IstatistikKarti
          etiket="Toplam gelir"
          deger={kurusTL(toplamOdenen._sum.tutarKurus ?? 0)}
          alt="Tüm zamanlar"
        />
      </div>

      {(okunmamisMesaj > 0 || bekleyenRandevu > 0) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {bekleyenRandevu > 0 && (
            <Link
              href="/admin/randevular"
              className="rounded-xl border border-altin-500/40 bg-altin-500/5 p-4 text-sm transition-colors hover:bg-altin-500/10"
            >
              <strong className="text-altin-400">{bekleyenRandevu} danışmanlık talebi</strong>{" "}
              <span className="text-metin2">seni bekliyor →</span>
            </Link>
          )}
          {okunmamisMesaj > 0 && (
            <Link
              href="/admin/mesajlar"
              className="rounded-xl border border-iz-500/40 bg-iz-500/5 p-4 text-sm transition-colors hover:bg-iz-500/10"
            >
              <strong className="text-iz-300">{okunmamisMesaj} okunmamış mesaj</strong>{" "}
              <span className="text-metin2">var →</span>
            </Link>
          )}
        </div>
      )}

      <section className="mt-9">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-baslik text-lg font-bold">Son siparişler</h2>
          <Link href="/admin/siparisler" className="text-sm text-altin-400 hover:underline">
            Tümünü gör →
          </Link>
        </div>

        <Tablo
          basliklar={["Tarih", "Müşteri", "Ürün", "Tutar", "Durum"]}
          bosMu={sonSiparisler.length === 0}
          bosMesaj="Henüz sipariş yok. İlk satışın burada görünecek."
        >
          {sonSiparisler.map((s) => (
            <tr key={s.id}>
              <td className="whitespace-nowrap px-4 py-3 text-metin3">
                {tarihSaatBicimi.format(s.createdAt)}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{s.adSoyad}</div>
                <div className="text-xs text-metin3">{s.email}</div>
              </td>
              <td className="px-4 py-3 text-metin2">{s.urunAdi}</td>
              <td className="whitespace-nowrap px-4 py-3 font-semibold">
                {kurusTL(s.tutarKurus)}
              </td>
              <td className="px-4 py-3">
                <DurumRozeti durum={s.durum} />
              </td>
            </tr>
          ))}
        </Tablo>
      </section>

      <p className="mt-8 text-xs text-metin3">
        Yayında {yayindaEgitim} eğitim var.{" "}
        <Link href="/admin/egitimler" className="text-altin-400 hover:underline">
          Eğitimleri yönet →
        </Link>
      </p>
    </>
  );
}
