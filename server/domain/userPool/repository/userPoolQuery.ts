import type { Prisma } from '@prisma/client';
import { genJwks } from 'service/privateKey';

export const userPoolQuery = {
  findJwks: (tx: Prisma.TransactionClient, userPoolId: string): Promise<object> =>
    tx.userPool
      .findUniqueOrThrow({ where: { id: userPoolId } })
      .then((pool) => genJwks(pool.privateKey)),
};
