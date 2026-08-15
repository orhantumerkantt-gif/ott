import type { Metadata } from "next";
import { OdemeBaslat } from "../../baslat";

export const metadata: Metadata = {
  title: "Eğitim Ödemesi",
  robots: { index: false, follow: false },
};

export default async function EgitimOdemesi({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ onay?: string }>;
}) {
  const { slug } = await params;
  const { onay } = await searchParams;
  return (
    <OdemeBaslat
      istek={{ tur: "EGITIM", slug }}
      geriYol={`/egitimler/${slug}`}
      onaylandi={onay === "1"}
    />
  );
}
