import type { Metadata } from "next";
import { OdemeBaslat } from "../../baslat";

export const metadata: Metadata = {
  title: "Eğitim Ödemesi",
  robots: { index: false, follow: false },
};

export default async function EgitimOdemesi({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <OdemeBaslat istek={{ tur: "EGITIM", slug }} geriYol={`/egitimler/${slug}`} />
  );
}
