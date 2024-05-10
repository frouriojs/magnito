import { prismaClient } from 'service/prismaClient';
import { s3 } from 'service/s3Client';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({
    status: 200,
    body: {
      server: 'ok',
      db: await prismaClient.$queryRaw`SELECT CURRENT_TIMESTAMP;`.then(() => 'ok' as const),
      storage: await s3.health().then(() => 'ok' as const),
    },
  }),
}));
