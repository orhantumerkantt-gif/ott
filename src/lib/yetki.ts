import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ROL, ABONELIK_DURUM } from "@/lib/sabitler";

/** Girişli kullanıcıyı döndürür; giriş yoksa /giris sayfasına yollar. */
export async function oturumZorunlu(donusYolu?: string) {
  const oturum = await auth();
  if (!oturum?.user?.id) {
    const hedef = donusYolu ? `/giris?devam=${encodeURIComponent(donusYolu)}` : "/giris";
    redirect(hedef);
  }
  return oturum.user;
}

/** Admin değilse ana sayfaya yollar. */
export async function adminZorunlu() {
  const kullanici = await oturumZorunlu("/admin");
  if (kullanici.rol !== ROL.ADMIN) redirect("/");
  return kullanici;
}

/** Oturum varsa kullanıcıyı, yoksa null döndürür (yönlendirme yapmaz). */
export async function oturumVarsa() {
  const oturum = await auth();
  return oturum?.user?.id ? oturum.user : null;
}

/**
 * Aboneliğin GERÇEKTEN geçerli olup olmadığını söyler.
 * Sadece durum alanına bakmak yetmez: dönem sonu geçmiş bir kayıt hâlâ
 * "AKTIF" görünebilir (yenileme işi henüz koşmamıştır). Tarih de kontrol edilir.
 */
export async function abonelikAktifMi(userId: string): Promise<boolean> {
  const abonelik = await db.subscription.findUnique({ where: { userId } });
  if (!abonelik) return false;
  if (abonelik.durum !== ABONELIK_DURUM.AKTIF) return false;
  if (!abonelik.donemSonu) return false;
  return abonelik.donemSonu.getTime() > Date.now();
}

/** Kullanıcı bu eğitime erişebilir mi? Satın alma VEYA aktif abonelik yeterli. */
export async function egitimErisimi(userId: string, courseId: string): Promise<boolean> {
  const kayit = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (kayit) return true;

  const kurs = await db.course.findUnique({
    where: { id: courseId },
    select: { abonelikDahil: true },
  });
  if (!kurs?.abonelikDahil) return false;

  return abonelikAktifMi(userId);
}
