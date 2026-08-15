import type { Metadata } from "next";
import { OdemeBaslat } from "../baslat";

export const metadata: Metadata = {
  title: "Abonelik Ödemesi",
  robots: { index: false, follow: false },
};

export default function AbonelikOdemesi() {
  return <OdemeBaslat istek={{ tur: "ABONELIK" }} geriYol="/abonelik" />;
}
