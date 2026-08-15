import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { ROL } from "@/lib/sabitler";

/**
 * Oturum stratejisi bilinçli olarak JWT.
 * Prisma adapter + veritabanı oturumu Edge çalışma zamanında çalışmıyor;
 * ayrıca bcrypt doğrulaması zaten Node tarafında yapılıyor.
 *
 * Sayfa koruması middleware ile DEĞİL, sunucu bileşenlerinde `oturumZorunlu()`
 * ile yapılır — middleware Edge'de koştuğu için bcrypt/Prisma oraya giremez.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/giris", error: "/giris" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-posta", type: "email" },
        sifre: { label: "Şifre", type: "password" },
      },
      async authorize(raw) {
        const parsed = z
          .object({ email: z.string().email(), sifre: z.string().min(1) })
          .safeParse(raw);
        if (!parsed.success) return null;

        const email = parsed.data.email.toLowerCase().trim();
        const kullanici = await db.user.findUnique({ where: { email } });
        if (!kullanici) {
          // Kullanıcı yoksa da bcrypt maliyetini öde: aksi halde yanıt süresi
          // "bu e-posta kayıtlı mı" bilgisini sızdırır (kullanıcı sayımı saldırısı).
          await bcrypt.compare(parsed.data.sifre, "$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin");
          return null;
        }

        const dogru = await bcrypt.compare(parsed.data.sifre, kullanici.passwordHash);
        if (!dogru) return null;

        return {
          id: kullanici.id,
          email: kullanici.email,
          name: kullanici.adSoyad,
          rol: kullanici.rol,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.rol = (user as { rol?: string }).rol ?? ROL.UYE;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.rol = (token.rol as string) ?? ROL.UYE;
      }
      return session;
    },
  },
});
