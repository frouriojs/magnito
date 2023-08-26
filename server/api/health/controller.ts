import { prismaClient } from '$/service/prismaClient';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({
    status: 200,
    body: {
      server: 'ok',
      db: await prismaClient.task
        .count()
        .then(() => 'ok' as const)
        .catch(() => 'ng' as const),
    },
  }),
}));
