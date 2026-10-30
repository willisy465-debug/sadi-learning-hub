import { PrismaClient } from '@prisma/client';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

/**
 * Vercel (and other serverless hosts) use a read-only filesystem except /tmp.
 * SQLite needs a writable path for the DB + WAL/SHM files, so copy the bundled
 * seed database into /tmp on cold start when still using file: SQLite.
 */
function ensureWritableSqliteUrl(): void {
  const current = process.env.DATABASE_URL || '';
  const isPostgres =
    current.startsWith('postgres://') ||
    current.startsWith('postgresql://') ||
    current.startsWith('prisma+postgres://');

  if (isPostgres) return;

  const onServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (!onServerless) return;

  const tmpPath = '/tmp/lms.db';
  if (!existsSync(tmpPath)) {
    const candidates = [
      join(process.cwd(), 'prisma', 'dev.db'),
      join(process.cwd(), 'dev.db'),
    ];
    for (const src of candidates) {
      if (!existsSync(src)) continue;
      mkdirSync(dirname(tmpPath), { recursive: true });
      copyFileSync(src, tmpPath);
      break;
    }
  }

  process.env.DATABASE_URL = `file:${tmpPath}`;
}

ensureWritableSqliteUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
