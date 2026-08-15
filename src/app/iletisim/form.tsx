"use client";

import { useActionState } from "react";
import { Alan, Buton, Uyari, girdiStil } from "@/components/ui";
import { mesajGonder, type IletisimDurum } from "./actions";

const baslangic: IletisimDurum = { durum: "bos" };

export function IletisimFormu() {
  const [state, formAction, bekliyor] = useActionState(mesajGonder, baslangic);
  // `alanHatalari` yalnız "hata" durumunda var; doğrudan okumak tip hatası verir.
  const hatalar = state.durum === "hata" ? state.alanHatalari : undefined;

  if (state.durum === "basarili") {
    return (
      <div className="rounded-2xl border border-gece-700 bg-gece-850 p-8">
        <Uyari tur="basari">
          <strong>Mesajın bana ulaştı.</strong> En kısa sürede dönüş yapacağım.
          Genellikle 1-2 iş günü sürüyor.
        </Uyari>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="grid gap-5 rounded-2xl border border-gece-700 bg-gece-850 p-6 sm:p-8"
    >
      {state.durum === "hata" && <Uyari tur="hata">{state.mesaj}</Uyari>}

      <Alan etiket="Ad Soyad" hata={hatalar?.adSoyad}>
        <input
          name="adSoyad"
          required
          autoComplete="name"
          className={girdiStil}
          placeholder="Adın ve soyadın"
        />
      </Alan>

      <Alan etiket="E-posta" hata={hatalar?.email}>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={girdiStil}
          placeholder="ornek@eposta.com"
        />
      </Alan>

      <Alan etiket="Telefon" ipucu="İsteğe bağlı" hata={hatalar?.telefon}>
        <input
          name="telefon"
          type="tel"
          autoComplete="tel"
          className={girdiStil}
          placeholder="05XX XXX XX XX"
        />
      </Alan>

      <Alan etiket="Mesajın" hata={hatalar?.mesaj}>
        <textarea
          name="mesaj"
          required
          rows={6}
          className={`${girdiStil} resize-y`}
          placeholder="Nasıl yardımcı olabilirim?"
        />
      </Alan>

      {/* Bal küpü: gerçek kullanıcı bunu görmez ve doldurmaz; bot doldurur.
          Dolu gelirse mesaj sessizce yok sayılır. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <Buton type="submit" disabled={bekliyor}>
        {bekliyor ? "Gönderiliyor…" : "Mesajı Gönder"}
      </Buton>

      <p className="text-xs leading-relaxed text-metin3">
        Gönderdiğin bilgiler yalnızca sana dönüş yapmak için kullanılır, üçüncü
        kişilerle paylaşılmaz. Ayrıntılar{" "}
        <a href="/yasal/kvkk-aydinlatma-metni" className="text-altin-400 hover:underline">
          KVKK Aydınlatma Metni
        </a>{" "}
        sayfasında.
      </p>
    </form>
  );
}
