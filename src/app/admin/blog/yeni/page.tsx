import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminBaslik } from "@/components/admin-ui";
import { YaziFormu } from "../yazi-formu";

export const metadata = { title: "Yeni Yazı" };

export default function YeniYazi() {
  return (
    <>
      <Link
        href="/admin/blog"
        className="mb-5 inline-flex items-center gap-2 text-sm text-metin2 hover:text-altin-400"
      >
        <ArrowLeft size={15} /> Blog
      </Link>
      <AdminBaslik baslik="Yeni Yazı" />
      <YaziFormu />
    </>
  );
}
