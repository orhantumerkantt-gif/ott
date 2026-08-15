"use client";

import { useActionState } from "react";
import { Alan, Buton, Uyari, girdiStil } from "@/components/ui";
import { egitimKaydet, type FormDurum } from "./actions";

const baslangic: FormDurum = { durum: "bos" };

export type EgitimVerisi = {
  id: string;
  baslik: string;
  slug: string;
  altBaslik: string | null;
  aciklama: string;
  seviye: string;
  fiyatKurus: number;
  eskiFiyatKurus: number | null;
  sureDk: number;
  sira: number;
  yayinda: boolean;
  oneCikan: boolean;
  abonelikDahil: boolean;
  seoBaslik: string | null;
  seoAciklama: string | null;
};

export function EgitimFormu({ egitim }: { egitim?: EgitimVerisi }) {
  const [state, formAction, bekliyor] = useActionState(
    egitimKaydet.bind(null, egitim?.id ?? null),
    baslangic,
  );
  const hatalar = state.durum === "hata" ? state.alanHatalari : undefined;

  return (
    <form action={formAction} className="grid gap-6">
      {state.durum === "hata" && <Uyari tur="hata">{state.mesaj}</Uyari>}

      <section className="grid gap-4 rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <h2 className="font-baslik text-base font-bold">Temel bilgiler</h2>

        <Alan etiket="Başlık" hata={hatalar?.baslik}>
          <input
            name="baslik"
            required
            defaultValue={egitim?.baslik}
            className={girdiStil}
            placeholder="Sıfırdan YouTube Kanalı Kurma"
          />
        </Alan>

        <Alan
          etiket="Alt başlık"
          ipucu="Kısa bir tanıtım cümlesi (isteğe bağlı)"
          hata={hatalar?.altBaslik}
        >
          <input
            name="altBaslik"
            defaultValue={egitim?.altBaslik ?? ""}
            className={girdiStil}
            placeholder="Kanal açmaktan para kazanmaya kadar"
          />
        </Alan>

        <Alan
          etiket="Adres (slug)"
          ipucu="Boş bırakırsan başlıktan otomatik üretilir. Yayındaki bir eğitimde değiştirmek eski bağlantıları kırar."
          hata={hatalar?.slug}
        >
          <input
            name="slug"
            defaultValue={egitim?.slug}
            className={girdiStil}
            placeholder="sifirdan-youtube-kanali"
          />
        </Alan>

        <Alan
          etiket="Açıklama"
          ipucu="Eğitim sayfasında görünecek tanıtım metni"
          hata={hatalar?.aciklama}
        >
          <textarea
            name="aciklama"
            required
            rows={7}
            defaultValue={egitim?.aciklama}
            className={`${girdiStil} resize-y`}
          />
        </Alan>

        <div className="grid gap-4 sm:grid-cols-3">
          <Alan etiket="Seviye" hata={hatalar?.seviye}>
            <select name="seviye" defaultValue={egitim?.seviye ?? "BASLANGIC"} className={girdiStil}>
              <option value="BASLANGIC">Başlangıç</option>
              <option value="ORTA">Orta</option>
              <option value="ILERI">İleri</option>
            </select>
          </Alan>

          <Alan etiket="Süre (dakika)" ipucu="0 = dersler toplanır" hata={hatalar?.sureDk}>
            <input
              name="sureDk"
              type="number"
              min={0}
              defaultValue={egitim?.sureDk ?? 0}
              className={girdiStil}
            />
          </Alan>

          <Alan etiket="Sıra" ipucu="Küçük olan üstte" hata={hatalar?.sira}>
            <input
              name="sira"
              type="number"
              min={0}
              defaultValue={egitim?.sira ?? 0}
              className={girdiStil}
            />
          </Alan>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <h2 className="font-baslik text-base font-bold">Fiyat</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Alan etiket="Satış fiyatı (TL)" hata={hatalar?.fiyatTL}>
            <input
              name="fiyatTL"
              type="number"
              min={0}
              step="0.01"
              required
              defaultValue={egitim ? egitim.fiyatKurus / 100 : ""}
              className={girdiStil}
              placeholder="1500"
            />
          </Alan>

          <Alan
            etiket="Eski fiyat (TL)"
            ipucu="Yazarsan üstü çizili görünür. Boş bırakabilirsin."
            hata={hatalar?.eskiFiyatTL}
          >
            <input
              name="eskiFiyatTL"
              type="number"
              min={0}
              step="0.01"
              defaultValue={egitim?.eskiFiyatKurus ? egitim.eskiFiyatKurus / 100 : ""}
              className={girdiStil}
              placeholder="2500"
            />
          </Alan>
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <h2 className="font-baslik text-base font-bold">Yayın</h2>

        <Kutucuk
          ad="yayinda"
          varsayilan={egitim?.yayinda ?? false}
          etiket="Yayında"
          aciklama="İşaretli değilse eğitim sitede görünmez (taslak)."
        />
        <Kutucuk
          ad="abonelikDahil"
          varsayilan={egitim?.abonelikDahil ?? true}
          etiket="Abonelik paketine dahil"
          aciklama="Aboneler bu eğitime ayrıca ödeme yapmadan erişir."
        />
        <Kutucuk
          ad="oneCikan"
          varsayilan={egitim?.oneCikan ?? false}
          etiket="Öne çıkan"
          aciklama="Listede rozet ile vurgulanır."
        />
      </section>

      <section className="grid gap-4 rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <h2 className="font-baslik text-base font-bold">Google (SEO)</h2>
        <p className="-mt-2 text-xs text-metin3">
          Boş bırakırsan başlık ve açıklama otomatik kullanılır.
        </p>

        <Alan etiket="Google başlığı" ipucu="60 karaktere kadar ideal">
          <input
            name="seoBaslik"
            defaultValue={egitim?.seoBaslik ?? ""}
            className={girdiStil}
          />
        </Alan>

        <Alan etiket="Google açıklaması" ipucu="155 karaktere kadar ideal">
          <textarea
            name="seoAciklama"
            rows={3}
            defaultValue={egitim?.seoAciklama ?? ""}
            className={`${girdiStil} resize-y`}
          />
        </Alan>
      </section>

      <div className="flex gap-3">
        <Buton type="submit" disabled={bekliyor}>
          {bekliyor ? "Kaydediliyor…" : egitim ? "Değişiklikleri Kaydet" : "Eğitimi Oluştur"}
        </Buton>
      </div>
    </form>
  );
}

function Kutucuk({
  ad,
  varsayilan,
  etiket,
  aciklama,
}: {
  ad: string;
  varsayilan: boolean;
  etiket: string;
  aciklama: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gece-700 p-4 transition-colors hover:border-gece-600">
      <input
        type="checkbox"
        name={ad}
        defaultChecked={varsayilan}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#ffc53d]"
      />
      <span>
        <span className="block text-sm font-medium">{etiket}</span>
        <span className="mt-0.5 block text-xs text-metin3">{aciklama}</span>
      </span>
    </label>
  );
}
