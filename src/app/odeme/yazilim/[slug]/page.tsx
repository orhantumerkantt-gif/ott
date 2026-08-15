import type { Metadata } from "next";
import { OdemeBaslat } from "../../baslat";

export const metadata: Metadata = {
  title: "Yazılım Ödemesi",
  robots: { index: false, follow: false },
};

export default async function YazilimOdemesi({
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
      istek={{ tur: "YAZILIM", slug }}
      geriYol="/yazilimlar"
      onaylandi={onay === "1"}
    />
  );
}
