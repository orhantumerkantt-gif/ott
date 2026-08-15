import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminBaslik } from "@/components/admin-ui";
import { YazilimFormu } from "../yazilim-formu";

export const metadata = { title: "Yeni Yazılım" };

export default function YeniYazilim() {
  return (
    <>
      <Link
        href="/admin/yazilimlar"
        className="mb-5 inline-flex items-center gap-2 text-sm text-metin2 hover:text-altin-400"
      >
        <ArrowLeft size={15} /> Yazılımlar
      </Link>
      <AdminBaslik baslik="Yeni Yazılım" />
      <YazilimFormu />
    </>
  );
}
