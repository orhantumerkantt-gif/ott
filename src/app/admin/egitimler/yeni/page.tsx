import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminBaslik } from "@/components/admin-ui";
import { EgitimFormu } from "../egitim-formu";

export const metadata = { title: "Yeni Eğitim" };

export default function YeniEgitim() {
  return (
    <>
      <Link
        href="/admin/egitimler"
        className="mb-5 inline-flex items-center gap-2 text-sm text-metin2 hover:text-altin-400"
      >
        <ArrowLeft size={15} /> Eğitimler
      </Link>

      <AdminBaslik
        baslik="Yeni Eğitim"
        aciklama="Önce temel bilgileri kaydet, sonra ders ekleyebilirsin."
      />

      <div className="max-w-3xl">
        <EgitimFormu />
      </div>
    </>
  );
}
