"use client";

import { useActionState } from "react";
import { Alan, Buton, Uyari, girdiStil } from "@/components/ui";
import { yeniSifreKaydet, type YeniSifreDurum } from "./actions";

const baslangic: YeniSifreDurum = { durum: "bos" };

export function YeniSifreFormu({ token }: { token: string }) {
  const [state, formAction, bekliyor] = useActionState(yeniSifreKaydet, baslangic);
  const hatalar = state.durum === "hata" ? state.alanHatalari : undefined;

  return (
    <form action={formAction} className="grid gap-4">
      {state.durum === "hata" && <Uyari tur="hata">{state.mesaj}</Uyari>}

      <input type="hidden" name="token" value={token} />

      <Alan
        etiket="Yeni şifre"
        ipucu="En az 8 karakter, harf ve rakam içermeli"
        hata={hatalar?.sifre}
      >
        <input
          name="sifre"
          type="password"
          required
          autoComplete="new-password"
          autoFocus
          className={girdiStil}
        />
      </Alan>

      <Alan etiket="Yeni şifre (tekrar)" hata={hatalar?.sifreTekrar}>
        <input
          name="sifreTekrar"
          type="password"
          required
          autoComplete="new-password"
          className={girdiStil}
        />
      </Alan>

      <Buton type="submit" disabled={bekliyor}>
        {bekliyor ? "Kaydediliyor…" : "Şifreyi Kaydet"}
      </Buton>
    </form>
  );
}
