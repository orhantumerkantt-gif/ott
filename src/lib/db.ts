import { PrismaClient } from "@prisma/client";

/**
 * Geliştirmede Next.js her hot-reload'da modülleri yeniden yükler.
 * Global'de tutulmazsa her yenilemede yeni bir bağlantı havuzu açılır ve
 * SQLite "too many connections" ile patlar.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
