import type { Prisma } from '@prisma/client';
import type { Jwks } from 'common/types/auth';
import type { UserPoolClientEntity, UserPoolEntity } from 'common/types/userPool';
import { genJwks } from 'service/privateKey';
import { toUserPoolClientEntity, toUserPoolEntity } from './toUserPoolEntity';

export const userPoolQuery = {
  listAll: (tx: Prisma.TransactionClient, limit?: number): Promise<UserPoolEntity[]> =>
    tx.userPool.findMany({ take: limit }).then((pools) => pools.map(toUserPoolEntity)),
  findById: (tx: Prisma.TransactionClient, userPoolId: string): Promise<UserPoolEntity> =>
    tx.userPool.findUniqueOrThrow({ where: { id: userPoolId } }).then(toUserPoolEntity),
  findJwks: (tx: Prisma.TransactionClient, userPoolId: string): Promise<Jwks> =>
    userPoolQuery.findById(tx, userPoolId).then((pool) => genJwks(pool.privateKey)),
  findClientById: (
    tx: Prisma.TransactionClient,
    poolClientId: string,
  ): Promise<UserPoolClientEntity> =>
    tx.userPoolClient
      .findUniqueOrThrow({ where: { id: poolClientId } })
      .then(toUserPoolClientEntity),
};
