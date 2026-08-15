"use client";

import { useActionState } from "react";
import { Alan, Buton, Uyari, girdiStil } from "@/components/ui";
import { yazilimKaydet, type FormDurum } from "./actions";

const baslangic: FormDurum = { durum: "bos" };

export type YazilimVerisi = {
  id: string;
  ad: string;
  slug: string;
  kisaAciklama: string;
  aciklama: string;
  fiyatKurus: number;
  surum: string;
  platform: string;
  indirmeUrl: string | null;
  sira: number;
  yayinda: boolean;
  abonelikDahil: boolean;
};

export function YazilimFormu({ yazilim }: { yazilim?: YazilimVerisi }) {
  const [state, formAction, bekliyor] = useActionState(
    yazilimKaydet.bind(null, yazilim?.id ?? null),
    baslangic,
  );
  const hatalar = state.durum === "hata" ? state.alanHatalari : undefined;

  return (
    <form action={formAction} className="grid max-w-3xl gap-6">
      {state.durum === "hata" && <Uyari tur="hata">{state.mesaj}</Uyari>}

      <section className="grid gap-4 rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <h2 className="font-baslik text-base font-bold">Yazılım bilgileri</h2>

        <Alan etiket="Ad" hata={hatalar?.ad}>
          <input name="ad" required defaultValue={yazilim?.ad} className={girdiStil} />
        </Alan>

        <Alan etiket="Adres (slug)" ipucu="Boş bırakırsan addan üretilir" hata={hatalar?.slug}>
          <input name="slug" defaultValue={yazilim?.slug} className={girdiStil} />
        </Alan>

        <Alan etiket="Kısa açıklama" ipucu="Listede tek satır görünür" hata={hatalar?.kisaAciklama}>
          <input
            name="kisaAciklama"
            required
            defaultValue={yazilim?.kisaAciklama}
            className={girdiStil}
          />
        </Alan>

        <Alan etiket="Açıklama" hata={hatalar?.aciklama}>
          <textarea
            name="aciklama"
            required
            rows={6}
            defaultValue={yazilim?.aciklama}
            className={`${girdiStil} resize-y`}
          />
        </Alan>

        <div className="grid gap-4 sm:grid-cols-3">
          <Alan etiket="Fiyat (TL)" hata={hatalar?.fiyatTL}>
            <input
              name="fiyatTL"
              type="number"
              min={0}
              step="0.01"
              required
              defaultValue={yazilim ? yazilim.fiyatKurus / 100 : ""}
              className={girdiStil}
            />
          </Alan>
          <Alan etiket="Sürüm" hata={hatalar?.surum}>
            <input
              name="surum"
              defaultValue={yazilim?.surum ?? "1.0.0"}
              className={girdiStil}
            />
          </Alan>
          <Alan etiket="Sıra" hata={hatalar?.sira}>
            <input
              name="sira"
              type="number"
              min={0}
              defaultValue={yazilim?.sira ?? 0}
              className={girdiStil}
            />
          </Alan>
        </div>

        <Alan etiket="Platform" hata={hatalar?.platform}>
          <input
            name="platform"
            defaultValue={yazilim?.platform ?? "Windows"}
            className={girdiStil}
          />
        </Alan>

        <Alan
          etiket="İndirme bağlantısı"
          ipucu="Dosyanın bulunduğu adres. Bu adres kimseye doğrudan gösterilmez; üye indirirken sistem güvenli bir bağlantı üretir."
          hata={hatalar?.indirmeUrl}
        >
          <input
            name="indirmeUrl"
            defaultValue={yazilim?.indirmeUrl ?? ""}
            className={girdiStil}
            placeholder="https://..."
          />
        </Alan>
      </section>

      <section className="grid gap-3 rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <h2 className="font-baslik text-base font-bold">Yayın</h2>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gece-700 p-4">
          <input
            type="checkbox"
            name="yayinda"
            defaultChecked={yazilim?.yayinda ?? false}
            className="mt-0.5 h-4 w-4 accent-[#ffc53d]"
          />
          <span>
            <span className="block text-sm font-medium">Yayında</span>
            <span className="mt-0.5 block text-xs text-metin3">
              İşaretli değilse sitede görünmez.
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gece-700 p-4">
          <input
            type="checkbox"
            name="abonelikDahil"
            defaultChecked={yazilim?.abonelikDahil ?? true}
            className="mt-0.5 h-4 w-4 accent-[#ffc53d]"
          />
          <span>
            <span className="block text-sm font-medium">Abonelik paketine dahil</span>
            <span className="mt-0.5 block text-xs text-metin3">
              Aboneler ayrıca ödeme yapmadan indirebilir.
            </span>
          </span>
        </label>
      </section>

      <div>
        <Buton type="submit" disabled={bekliyor}>
          {bekliyor ? "Kaydediliyor…" : yazilim ? "Değişiklikleri Kaydet" : "Yazılımı Oluştur"}
        </Buton>
      </div>
    </form>
  );
}
