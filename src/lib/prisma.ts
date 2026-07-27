import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

import path from 'path';

function getDbUrl() {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }
  // Ensure the Prisma Client finds the dev.db with an absolute path
  return 'file:' + path.join(process.cwd(), 'prisma', 'dev.db');
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDbUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
