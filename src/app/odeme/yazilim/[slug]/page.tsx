import type { Metadata } from "next";
import { OdemeBaslat } from "../../baslat";

export const metadata: Metadata = {
  title: "Yazılım Ödemesi",
  robots: { index: false, follow: false },
};

export default async function YazilimOdemesi({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <OdemeBaslat istek={{ tur: "YAZILIM", slug }} geriYol="/yazilimlar" />;
}
