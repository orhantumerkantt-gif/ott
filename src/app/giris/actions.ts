"use server";

import { z } from "zod";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export type GirisDurum = { durum: "bos" } | { durum: "hata"; mesaj: string };

const sema = z.object({
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta yaz."),
  sifre: z.string().min(1, "Şifreni yaz."),
  devam: z.string().optional(),
});

/** Açık yönlendirme (open redirect) korumasi: sadece kendi sitemizin yolu kabul edilir. */
function guvenliYol(deger: string | undefined): string {
  if (!deger) return "/panel";
  // "//baska-site.com" ve "https://…" gibi dış adresler engellenir
  if (!deger.startsWith("/") || deger.startsWith("//")) return "/panel";
  return deger;
}

export async function girisYap(
  _oncekiDurum: GirisDurum,
  formData: FormData,
): Promise<GirisDurum> {
  const sonuc = sema.safeParse({
    email: formData.get("email"),
    sifre: formData.get("sifre"),
    devam: formData.get("devam"),
  });

  if (!sonuc.success) {
    return { durum: "hata", mesaj: "E-posta ve şifreni kontrol et." };
  }

  try {
    await signIn("credentials", {
      email: sonuc.data.email,
      sifre: sonuc.data.sifre,
      redirect: false,
    });
  } catch (e) {
    if (e instanceof AuthError) {
      // Hangi alanın yanlış olduğunu SÖYLEMİYORUZ. "E-posta bulunamadı" demek,
      // saldırgana hangi adreslerin kayıtlı olduğunu tek tek denetme imkânı verir.
      return { durum: "hata", mesaj: "E-posta veya şifre hatalı." };
    }
    throw e;
  }

  redirect(guvenliYol(sonuc.data.devam));
}
