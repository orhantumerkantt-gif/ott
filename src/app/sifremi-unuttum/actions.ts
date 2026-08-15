"use server";

import crypto from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { site } from "@/lib/site";
import { epostaGonder, epostaSablonu } from "@/lib/eposta";

export type SifirlaDurum =
  | { durum: "bos" }
  | { durum: "gonderildi" }
  | { durum: "hata"; mesaj: string };

const TOKEN_GECERLILIK_DK = 60;

export async function sifirlamaBaglantisiGonder(
  _oncekiDurum: SifirlaDurum,
  formData: FormData,
): Promise<SifirlaDurum> {
  const sonuc = z
    .object({ email: z.string().trim().toLowerCase().email() })
    .safeParse({ email: formData.get("email") });

  if (!sonuc.success) {
    return { durum: "hata", mesaj: "Geçerli bir e-posta adresi yaz." };
  }

  const kullanici = await db.user.findUnique({
    where: { email: sonuc.data.email },
    select: { id: true, adSoyad: true, email: true },
  });

  // Kullanıcı bulunamasa bile "gönderildi" diyoruz. Aksi halde bu form,
  // "bu e-posta sitede kayıtlı mı" sorusunu yanıtlayan bir araca dönüşür.
  if (kullanici) {
    const token = crypto.randomBytes(32).toString("hex");
    await db.user.update({
      where: { id: kullanici.id },
      data: {
        sifreToken: token,
        sifreTokenSonu: new Date(Date.now() + TOKEN_GECERLILIK_DK * 60_000),
      },
    });

    const url = `${site.url}/sifre-sifirla?token=${token}`;
    await epostaGonder({
      kime: kullanici.email,
      konu: "Şifre sıfırlama bağlantın",
      html: epostaSablonu(
        "Şifreni sıfırla",
        `<p>Merhaba ${kullanici.adSoyad},</p>
         <p>Şifreni sıfırlamak için aşağıdaki butona tıkla. Bağlantı
         <strong>${TOKEN_GECERLILIK_DK} dakika</strong> geçerli.</p>
         <p>Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin;
         şifren değişmez.</p>`,
        "Şifremi Sıfırla",
        url,
      ),
      duzMetin: `Şifreni sıfırlamak için: ${url} (${TOKEN_GECERLILIK_DK} dakika geçerli)`,
    });
  }

  return { durum: "gonderildi" };
}
