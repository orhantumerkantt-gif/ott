"use client";

import { useActionState } from "react";
import { Alan, Buton, Uyari, girdiStil } from "@/components/ui";
import { yaziKaydet, type FormDurum } from "./actions";

const baslangic: FormDurum = { durum: "bos" };

export type YaziVerisi = {
  id: string;
  baslik: string;
  slug: string;
  ozet: string;
  icerik: string;
  etiketler: string;
  seoBaslik: string | null;
  seoAciklama: string | null;
  yayinda: boolean;
};

export function YaziFormu({ yazi }: { yazi?: YaziVerisi }) {
  const [state, formAction, bekliyor] = useActionState(
    yaziKaydet.bind(null, yazi?.id ?? null),
    baslangic,
  );
  const hatalar = state.durum === "hata" ? state.alanHatalari : undefined;

  return (
    <form action={formAction} className="grid max-w-3xl gap-6">
      {state.durum === "hata" && <Uyari tur="hata">{state.mesaj}</Uyari>}

      <section className="grid gap-4 rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <Alan etiket="Başlık" hata={hatalar?.baslik}>
          <input name="baslik" required defaultValue={yazi?.baslik} className={girdiStil} />
        </Alan>

        <Alan etiket="Adres (slug)" ipucu="Boş bırakırsan başlıktan üretilir" hata={hatalar?.slug}>
          <input name="slug" defaultValue={yazi?.slug} className={girdiStil} />
        </Alan>

        <Alan
          etiket="Özet"
          ipucu="Liste sayfasında ve Google'da görünür"
          hata={hatalar?.ozet}
        >
          <textarea
            name="ozet"
            required
            rows={3}
            defaultValue={yazi?.ozet}
            className={`${girdiStil} resize-y`}
          />
        </Alan>

        <Alan
          etiket="İçerik"
          ipucu="Basit biçimlendirme: ## Başlık · **kalın** · *eğik* · - liste maddesi"
          hata={hatalar?.icerik}
        >
          <textarea
            name="icerik"
            required
            rows={18}
            defaultValue={yazi?.icerik}
            className={`${girdiStil} resize-y font-mono text-[13px] leading-relaxed`}
          />
        </Alan>

        <Alan etiket="Etiketler" ipucu="Virgülle ayır: yapay zeka, youtube, algoritma">
          <input name="etiketler" defaultValue={yazi?.etiketler} className={girdiStil} />
        </Alan>
      </section>

      <section className="grid gap-4 rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <h2 className="font-baslik text-base font-bold">Google (SEO)</h2>
        <Alan etiket="Google başlığı">
          <input name="seoBaslik" defaultValue={yazi?.seoBaslik ?? ""} className={girdiStil} />
        </Alan>
        <Alan etiket="Google açıklaması">
          <textarea
            name="seoAciklama"
            rows={3}
            defaultValue={yazi?.seoAciklama ?? ""}
            className={`${girdiStil} resize-y`}
          />
        </Alan>
      </section>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gece-700 bg-gece-850 p-6">
        <input
          type="checkbox"
          name="yayinda"
          defaultChecked={yazi?.yayinda ?? false}
          className="mt-0.5 h-4 w-4 accent-[#ffc53d]"
        />
        <span>
          <span className="block text-sm font-medium">Yayında</span>
          <span className="mt-0.5 block text-xs text-metin3">
            İşaretli değilse yazı sitede görünmez.
          </span>
        </span>
      </label>

      <div>
        <Buton type="submit" disabled={bekliyor}>
          {bekliyor ? "Kaydediliyor…" : yazi ? "Değişiklikleri Kaydet" : "Yazıyı Oluştur"}
        </Buton>
      </div>
    </form>
  );
}
