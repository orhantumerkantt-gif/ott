import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Plus, Eye, EyeOff } from "lucide-react";
import { db } from "@/lib/db";
import { adminZorunlu } from "@/lib/yetki";
import { AdminBaslik, Tablo, tarihBicimi } from "@/components/admin-ui";
import { ButonLink } from "@/components/ui";

export const metadata = { title: "Blog" };

async function yayinDurumuDegistir(id: string, yayinla: boolean) {
  "use server";
  await adminZorunlu();

  await db.post.update({
    where: { id },
    data: {
      yayinda: yayinla,
      // İlk kez yayınlanıyorsa tarihi şimdi damgala; daha önce yayınlanmışsa
      // özgün tarih korunur (sıralama ve SEO için önemli).
      ...(yayinla ? { yayinTarihi: { set: new Date() } } : {}),
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export default async function AdminBlog() {
  const yazilar = await db.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <AdminBaslik
        baslik="Blog"
        aciklama="Google'dan ziyaretçi çeken yazılar. Düzenli yazmak organik trafiği artırır."
        eylem={
          <ButonLink href="/admin/blog/yeni">
            <Plus size={16} /> Yeni Yazı
          </ButonLink>
        }
      />

      <Tablo
        basliklar={["Başlık", "Yayın tarihi", "Okuma", "Durum", ""]}
        bosMu={yazilar.length === 0}
        bosMesaj="Henüz yazı yok."
      >
        {yazilar.map((y) => (
          <tr key={y.id}>
            <td className="px-4 py-3">
              <div className="font-medium">{y.baslik}</div>
              <div className="mt-0.5 text-xs text-metin3">/{y.slug}</div>
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-metin3">
              {y.yayinTarihi ? tarihBicimi.format(y.yayinTarihi) : "—"}
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-metin2">{y.okumaDk} dk</td>
            <td className="px-4 py-3">
              <form action={yayinDurumuDegistir.bind(null, y.id, !y.yayinda)}>
                <button
                  type="submit"
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    y.yayinda
                      ? "bg-basari/15 text-basari hover:bg-basari/25"
                      : "bg-gece-700 text-metin3 hover:bg-gece-600"
                  }`}
                >
                  {y.yayinda ? <Eye size={11} /> : <EyeOff size={11} />}
                  {y.yayinda ? "Yayında" : "Taslak"}
                </button>
              </form>
            </td>
            <td className="whitespace-nowrap px-4 py-3 text-right">
              <Link
                href={`/admin/blog/${y.id}`}
                className="text-sm font-semibold text-altin-400 hover:underline"
              >
                Düzenle
              </Link>
            </td>
          </tr>
        ))}
      </Tablo>
    </>
  );
}
