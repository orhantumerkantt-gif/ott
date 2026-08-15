"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Alan, Buton, Uyari, girdiStil } from "@/components/ui";
import { girisYap, type GirisDurum } from "./actions";

const baslangic: GirisDurum = { durum: "bos" };

export function GirisFormu({ devam }: { devam?: string }) {
  const [state, formAction, bekliyor] = useActionState(girisYap, baslangic);

  return (
    <form action={formAction} className="grid gap-4">
      {state.durum === "hata" && <Uyari tur="hata">{state.mesaj}</Uyari>}

      <input type="hidden" name="devam" value={devam ?? ""} />

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

      <Alan etiket="Şifre">
        <input
          name="sifre"
          type="password"
          required
          autoComplete="current-password"
          className={girdiStil}
        />
      </Alan>

      <div className="-mt-1 text-right">
        <Link
          href="/sifremi-unuttum"
          className="text-[13px] text-metin2 hover:text-altin-400"
        >
          Şifremi unuttum
        </Link>
      </div>

      <Buton type="submit" disabled={bekliyor}>
        {bekliyor ? "Giriş yapılıyor…" : "Giriş Yap"}
      </Buton>
    </form>
  );
}
