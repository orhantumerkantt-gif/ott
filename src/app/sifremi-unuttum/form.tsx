"use client";

import { useActionState } from "react";
import { Alan, Buton, Uyari, girdiStil } from "@/components/ui";
import { sifirlamaBaglantisiGonder, type SifirlaDurum } from "./actions";

const baslangic: SifirlaDurum = { durum: "bos" };

export function SifremiUnuttumFormu() {
  const [state, formAction, bekliyor] = useActionState(
    sifirlamaBaglantisiGonder,
    baslangic,
  );

  if (state.durum === "gonderildi") {
    return (
      <Uyari tur="basari">
        <strong>Bağlantı gönderildi.</strong> Girdiğin adres sistemde kayıtlıysa
        şifre sıfırlama bağlantısı e-postana ulaşacak. Bağlantı 60 dakika geçerli.
      </Uyari>
    );
  }

  return (
    <form action={formAction} className="grid gap-4">
      {state.durum === "hata" && <Uyari tur="hata">{state.mesaj}</Uyari>}

      <Alan etiket="E-posta">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          className={girdiStil}
          placeholder="ornek@eposta.com"
        />
      </Alan>

      <Buton type="submit" disabled={bekliyor}>
        {bekliyor ? "Gönderiliyor…" : "Sıfırlama Bağlantısı Gönder"}
      </Buton>
    </form>
  );
}
