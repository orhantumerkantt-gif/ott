import { LogOut } from "lucide-react";
import { signOut } from "@/auth";

/**
 * Çıkış işlemi POST ile yapılır (form + server action).
 * Basit bir <a href="/cikis"> olsaydı; tarayıcı ön yüklemesi, bir bağlantı
 * tarayıcısı veya sayfadaki bir görsel isteği kullanıcıyı istemeden
 * oturumdan düşürebilirdi (CSRF benzeri yan etki).
 */
export function CikisButonu({ className = "" }: { className?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-metin2 transition-colors hover:bg-gece-800 hover:text-hata ${className}`}
      >
        <LogOut size={15} /> Çıkış Yap
      </button>
    </form>
  );
}
