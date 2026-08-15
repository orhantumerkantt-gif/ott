"use client";

import { useActionState } from "react";
import { Alan, Buton, Uyari, girdiStil } from "@/components/ui";
import { randevuTalepEt, type RandevuDurum } from "./actions";

const baslangic: RandevuDurum = { durum: "bos" };

export function RandevuFormu({
  varsayilan,
}: {
  varsayilan: { adSoyad: string; email: string; telefon: string };
}) {
  const [state, formAction, bekliyor] = useActionState(randevuTalepEt, baslangic);
  const hatalar = state.durum === "hata" ? state.alanHatalari : undefined;

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-2xl border border-gece-700 bg-gece-850 p-6 sm:p-8"
    >
      {state.durum === "hata" && <Uyari tur="hata">{state.mesaj}</Uyari>}

      <Alan etiket="Ad Soyad" hata={hatalar?.adSoyad}>
        <input
          name="adSoyad"
          required
          autoComplete="name"
          defaultValue={varsayilan.adSoyad}
          className={girdiStil}
        />
      </Alan>

      <div className="grid gap-4 sm:grid-cols-2">
        <Alan etiket="E-posta" hata={hatalar?.email}>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={varsayilan.email}
            className={girdiStil}
          />
        </Alan>

        <Alan etiket="Telefon" hata={hatalar?.telefon}>
          <input
            name="telefon"
            type="tel"
            required
            autoComplete="tel"
            defaultValue={varsayilan.telefon}
            className={girdiStil}
            placeholder="05XX XXX XX XX"
          />
        </Alan>
      </div>

      <Alan
        etiket="Kanal / profil adresin"
        ipucu="Görüşmeden önce inceleyebilmem için (isteğe bağlı)"
        hata={hatalar?.kanalAdresi}
      >
        <input
          name="kanalAdresi"
          className={girdiStil}
          placeholder="youtube.com/@kanalim"
        />
      </Alan>

      <Alan
        etiket="Neyi konuşmak istiyorsun?"
        ipucu="Ne kadar ayrıntı yazarsan görüşme o kadar verimli geçer"
        hata={hatalar?.konu}
      >
        <textarea
          name="konu"
          required
          rows={6}
          className={`${girdiStil} resize-y`}
          placeholder="Örnek: Kanalım 6 aydır 2.000 abonede takıldı. Video başına 300-500 izlenme alıyorum. Neyi yanlış yaptığımı anlamak istiyorum."
        />
      </Alan>

      <Alan
        etiket="Ne zaman uygunsun?"
        ipucu="Serbest yazabilirsin"
        hata={hatalar?.tercihTarih}
      >
        <input
          name="tercihTarih"
          required
          className={girdiStil}
          placeholder="Hafta içi akşam 20:00 sonrası veya cumartesi öğleden sonra"
        />
      </Alan>

      {/* Bal küpü — bkz. iletişim formu */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <Buton type="submit" disabled={bekliyor}>
        {bekliyor ? "Gönderiliyor…" : "Randevu Talebi Gönder"}
      </Buton>

      <p className="text-xs leading-relaxed text-metin3">
        Bu form <strong>ödeme almaz.</strong> Talebini aldıktan sonra uygun saatleri
        paylaşıyorum; tarih kesinleşince ödeme bağlantısını gönderiyorum.
      </p>
    </form>
  );
}
