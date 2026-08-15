import Link from "next/link";
import {
  LayoutDashboard,
  GraduationCap,
  Package,
  Users,
  ShoppingBag,
  CalendarCheck,
  MessageSquare,
  FileText,
  Settings,
  ExternalLink,
} from "lucide-react";
import { adminZorunlu } from "@/lib/yetki";
import { Logo } from "@/components/marka/logo";
import { CikisButonu } from "@/components/cikis-butonu";

export const metadata = {
  title: { default: "Yönetim", template: "%s | Yönetim" },
  robots: { index: false, follow: false },
};

const menu = [
  { ad: "Genel Bakış", href: "/admin", ikon: LayoutDashboard },
  { ad: "Eğitimler", href: "/admin/egitimler", ikon: GraduationCap },
  { ad: "Yazılımlar", href: "/admin/yazilimlar", ikon: Package },
  { ad: "Siparişler", href: "/admin/siparisler", ikon: ShoppingBag },
  { ad: "Üyeler", href: "/admin/uyeler", ikon: Users },
  { ad: "Randevular", href: "/admin/randevular", ikon: CalendarCheck },
  { ad: "Mesajlar", href: "/admin/mesajlar", ikon: MessageSquare },
  { ad: "Blog", href: "/admin/blog", ikon: FileText },
  { ad: "Ayarlar", href: "/admin/ayarlar", ikon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Her admin sayfasında tek noktadan yetki kontrolü.
  await adminZorunlu();

  return (
    <div className="grid min-h-screen lg:grid-cols-[248px_1fr]">
      <aside className="border-b border-gece-700 bg-gece-900 lg:border-b-0 lg:border-r">
        <div className="sticky top-0 flex h-full flex-col p-4">
          <Link href="/admin" className="mb-6 block px-2 pt-2">
            <Logo />
            <span className="mt-2 block text-[10px] font-bold tracking-[0.18em] text-metin3">
              YÖNETİM PANELİ
            </span>
          </Link>

          <nav className="grid gap-1" aria-label="Yönetim menüsü">
            {menu.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-metin2 transition-colors hover:bg-gece-800 hover:text-metin"
              >
                <m.ikon size={16} className="shrink-0" />
                {m.ad}
              </Link>
            ))}
          </nav>

          <div className="mt-auto grid gap-1 border-t border-gece-700 pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-metin2 transition-colors hover:bg-gece-800 hover:text-metin"
            >
              <ExternalLink size={16} /> Siteyi Görüntüle
            </Link>
            <CikisButonu className="w-full justify-start px-3" />
          </div>
        </div>
      </aside>

      <main className="min-w-0 p-5 sm:p-8">{children}</main>
    </div>
  );
}
