import { db } from "@/lib/db";
import { ABONELIK_DURUM, ROL } from "@/lib/sabitler";
import {
  AdminBaslik,
  Tablo,
  DurumRozeti,
  IstatistikKarti,
  tarihBicimi,
} from "@/components/admin-ui";

export const metadata = { title: "Üyeler" };

const SAYFA_BOYUTU = 50;

export default async function AdminUyeler({
  searchParams,
}: {
  searchParams: Promise<{ ara?: string; sayfa?: string }>;
}) {
  const { ara, sayfa } = await searchParams;
  const sayfaNo = Math.max(1, Number(sayfa) || 1);

  const filtre = ara
    ? {
        OR: [
          { email: { contains: ara } },
          { adSoyad: { contains: ara } },
        ],
      }
    : {};

  const simdi = new Date();
  const [uyeler, toplam, aktifAbone] = await Promise.all([
    db.user.findMany({
      where: filtre,
      orderBy: { createdAt: "desc" },
      skip: (sayfaNo - 1) * SAYFA_BOYUTU,
      take: SAYFA_BOYUTU,
      include: {
        abonelik: true,
        _count: { select: { kayitlar: true, siparisler: true } },
      },
    }),
    db.user.count({ where: filtre }),
    db.subscription.count({
      where: { durum: ABONELIK_DURUM.AKTIF, donemSonu: { gt: simdi } },
    }),
  ]);

  const sonSayfa = Math.max(1, Math.ceil(toplam / SAYFA_BOYUTU));

  return (
    <>
      <AdminBaslik baslik="Üyeler" aciklama="Kayıtlı hesaplar ve abonelik durumları." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <IstatistikKarti etiket="Toplam üye" deger={String(toplam)} />
        <IstatistikKarti etiket="Aktif abone" deger={String(aktifAbone)} vurgu />
      </div>

      <form className="mb-4 flex gap-2">
        <input
          name="ara"
          defaultValue={ara ?? ""}
          placeholder="Ad veya e-posta ara…"
          className="w-full max-w-xs rounded-xl border border-gece-600 bg-gece-900 px-4 py-2.5 text-sm text-metin placeholder:text-metin3 focus:border-altin-400 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl border border-gece-600 px-4 py-2.5 text-sm font-medium hover:border-altin-500"
        >
          Ara
        </button>
      </form>

      <Tablo
        basliklar={["Üye", "Kayıt", "Abonelik", "Eğitim", "Sipariş", "Rol"]}
        bosMu={uyeler.length === 0}
        bosMesaj={ara ? "Aramaya uyan üye yok." : "Henüz üye yok."}
      >
        {uyeler.map((u) => {
          const abonelikAktif =
            u.abonelik?.durum === ABONELIK_DURUM.AKTIF &&
            u.abonelik.donemSonu &&
            u.abonelik.donemSonu > simdi;

          return (
            <tr key={u.id}>
              <td className="px-4 py-3">
                <div className="font-medium">{u.adSoyad}</div>
                <div className="text-xs text-metin3">{u.email}</div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-metin3">
                {tarihBicimi.format(u.createdAt)}
              </td>
              <td className="px-4 py-3">
                {u.abonelik ? (
                  <>
                    <DurumRozeti durum={abonelikAktif ? "AKTIF" : u.abonelik.durum} />
                    {u.abonelik.donemSonu && (
                      <div className="mt-1 text-xs text-metin3">
                        {tarihBicimi.format(u.abonelik.donemSonu)}&apos;e kadar
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-metin3">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-metin2">{u._count.kayitlar}</td>
              <td className="px-4 py-3 text-metin2">{u._count.siparisler}</td>
              <td className="px-4 py-3">
                {u.rol === ROL.ADMIN ? (
                  <span className="rounded-full bg-altin-500/15 px-2.5 py-1 text-[11px] font-semibold text-altin-400">
                    Yönetici
                  </span>
                ) : (
                  <span className="text-xs text-metin3">Üye</span>
                )}
              </td>
            </tr>
          );
        })}
      </Tablo>

      {sonSayfa > 1 && (
        <div className="mt-5 text-center text-sm text-metin3">
          Sayfa {sayfaNo} / {sonSayfa}
        </div>
      )}
    </>
  );
}
