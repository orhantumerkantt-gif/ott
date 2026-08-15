import type { Metadata } from "next";
import { OdemeBaslat } from "../baslat";

export const metadata: Metadata = {
  title: "Abonelik Ödemesi",
  robots: { index: false, follow: false },
};

export default async function AbonelikOdemesi({
  searchParams,
}: {
  searchParams: Promise<{ onay?: string }>;
}) {
  const { onay } = await searchParams;
  return (
    <OdemeBaslat
      istek={{ tur: "ABONELIK" }}
      geriYol="/abonelik"
      onaylandi={onay === "1"}
    />
  );
}
