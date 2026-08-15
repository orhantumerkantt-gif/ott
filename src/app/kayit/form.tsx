"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Alan, Buton, Uyari, girdiStil } from "@/components/ui";
import { kayitOl, type KayitDurum } from "./actions";

const baslangic: KayitDurum = { durum: "bos" };

export function KayitFormu() {
  const [state, formAction, bekliyor] = useActionState(kayitOl, baslangic);
  const hatalar = state.durum === "hata" ? state.alanHatalari : undefined;

  return (
    <form action={formAction} className="grid gap-4">
      {state.durum === "hata" && <Uyari tur="hata">{state.mesaj}</Uyari>}

      <Alan etiket="Ad Soyad" hata={hatalar?.adSoyad}>
        <input name="adSoyad" required autoComplete="name" className={girdiStil} />
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
        <input name="telefon" type="tel" autoComplete="tel" className={girdiStil} />
      </Alan>

      <Alan
        etiket="Şifre"
        ipucu="En az 8 karakter, harf ve rakam içermeli"
        hata={hatalar?.sifre}
      >
        <input
          name="sifre"
          type="password"
          required
          autoComplete="new-password"
          className={girdiStil}
        />
      </Alan>

      <Alan etiket="Şifre (tekrar)" hata={hatalar?.sifreTekrar}>
        <input
          name="sifreTekrar"
          type="password"
          required
          autoComplete="new-password"
          className={girdiStil}
        />
      </Alan>

      <label className="flex items-start gap-3 text-[13px] leading-relaxed text-metin2">
        <input
          type="checkbox"
          name="sozlesme"
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#ffc53d]"
        />
        <span>
          <Link href="/yasal/mesafeli-satis-sozlesmesi" className="text-altin-400 hover:underline">
            Mesafeli Satış Sözleşmesi
          </Link>
          ,{" "}
          <Link href="/yasal/gizlilik-politikasi" className="text-altin-400 hover:underline">
            Gizlilik Politikası
          </Link>{" "}
          ve{" "}
          <Link href="/yasal/kvkk-aydinlatma-metni" className="text-altin-400 hover:underline">
            KVKK Aydınlatma Metni
          </Link>
          &apos;ni okudum, kabul ediyorum.
        </span>
      </label>
      {hatalar?.sozlesme && (
        <span className="-mt-2 text-xs text-hata">{hatalar.sozlesme}</span>
      )}

      <Buton type="submit" disabled={bekliyor} className="mt-2">
        {bekliyor ? "Hesap oluşturuluyor…" : "Ücretsiz Hesap Oluştur"}
      </Buton>
    </form>
  );
}
