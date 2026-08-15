import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { adminZorunlu } from "@/lib/yetki";
import { site, kurusTL } from "@/lib/site";
import { odemeTestModundaMi } from "@/lib/odeme";
import { AdminBaslik } from "@/components/admin-ui";
import { Alan, Buton, Uyari, girdiStil } from "@/components/ui";

export const metadata = { title: "Ayarlar" };

async function abonelikFiyatiKaydet(formData: FormData) {
  "use server";
  await adminZorunlu();

  const sonuc = z
    .object({
      fiyatTL: z.coerce.number().min(1).max(1_000_000),
      ad: z.string().trim().min(2).max(100),
      ozellikler: z.string().trim().max(2000),
    })
    .safeParse({
      fiyatTL: formData.get("fiyatTL"),
      ad: formData.get("ad"),
      ozellikler: formData.get("ozellikler"),
    });

  if (!sonuc.success) return;

  // Her satır bir özellik maddesi; boş satırlar atılır.
  const liste = sonuc.data.ozellikler
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  await db.plan.update({
    where: { slug: "aylik" },
    data: {
      ad: sonuc.data.ad,
      fiyatKurus: Math.round(sonuc.data.fiyatTL * 100),
      ozellikler: JSON.stringify(liste),
    },
  });

  revalidatePath("/abonelik");
  revalidatePath("/admin/ayarlar");
}

export default async function AdminAyarlar() {
  const plan = await db.plan.findUnique({ where: { slug: "aylik" } });
  const ozellikler: string[] = plan?.ozellikler ? JSON.parse(plan.ozellikler) : [];

  return (
    <>
      <AdminBaslik
        baslik="Ayarlar"
        aciklama="Fiyatları ve sistem durumunu buradan yönetirsin."
      />

      <div className="grid max-w-3xl gap-6">
        <form
          action={abonelikFiyatiKaydet}
          className="grid gap-4 rounded-2xl border border-gece-700 bg-gece-850 p-6"
        >
          <h2 className="font-baslik text-base font-bold">Aylık abonelik</h2>
          <p className="-mt-2 text-xs text-metin3">
            Burada yaptığın değişiklik abonelik sayfasına anında yansır.
            Mevcut abonelerin ödemesi dönem sonuna kadar değişmez.
          </p>

          <Alan etiket="Plan adı">
            <input
              name="ad"
              required
              defaultValue={plan?.ad ?? "Aylık Abonelik"}
              className={girdiStil}
            />
          </Alan>

          <Alan etiket="Aylık fiyat (TL)">
            <input
              name="fiyatTL"
              type="number"
              min={1}
              step="0.01"
              required
              defaultValue={plan ? plan.fiyatKurus / 100 : 2500}
              className={girdiStil}
            />
          </Alan>

          <Alan
            etiket="Özellik listesi"
            ipucu="Her satır bir madde olarak görünür"
          >
            <textarea
              name="ozellikler"
              rows={6}
              defaultValue={ozellikler.join("\n")}
              className={`${girdiStil} resize-y`}
            />
          </Alan>

          <div>
            <Buton type="submit">Kaydet</Buton>
          </div>
        </form>

        <section className="rounded-2xl border border-gece-700 bg-gece-850 p-6">
          <h2 className="mb-4 font-baslik text-base font-bold">Sistem durumu</h2>

          <dl className="grid gap-3 text-sm">
            <Satir
              etiket="Ödeme sistemi"
              deger={odemeTestModundaMi() ? "Test modu" : "Canlı"}
              uyari={odemeTestModundaMi()}
            />
            <Satir etiket="Site adresi" deger={site.url} />
            <Satir
              etiket="Danışmanlık ücreti"
              deger={`${kurusTL(500_000)} / saat`}
              not="Kod dosyasından değişir (src/lib/site.ts)"
            />
            <Satir
              etiket="Satıcı bilgileri"
              deger={site.saticiBilgileri.adres ? "Tamam" : "EKSİK"}
              uyari={!site.saticiBilgileri.adres}
              not={
                site.saticiBilgileri.adres
                  ? undefined
                  : "Yasal sayfalar için adres, telefon ve vergi bilgisi gerekli"
              }
            />
          </dl>
        </section>

        {odemeTestModundaMi() && (
          <Uyari tur="bilgi">
            <strong>Canlıya geçmek için:</strong> site Vercel&apos;e yüklenmeli ve PayTR
            panelinde <strong>Bildirim URL</strong> alanına{" "}
            <code className="rounded bg-gece-800 px-1.5 py-0.5 text-xs">
              https://www.dedektiforhan.com/api/odeme/bildirim
            </code>{" "}
            yazılmalı.
          </Uyari>
        )}
      </div>
    </>
  );
}

function Satir({
  etiket,
  deger,
  not,
  uyari = false,
}: {
  etiket: string;
  deger: string;
  not?: string;
  uyari?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gece-700 pb-3 last:border-0">
      <dt className="text-metin2">{etiket}</dt>
      <dd className="text-right">
        <span className={uyari ? "font-semibold text-uyari" : "font-medium"}>{deger}</span>
        {not && <span className="mt-0.5 block text-xs text-metin3">{not}</span>}
      </dd>
    </div>
  );
}
