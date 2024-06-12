import type { Prisma } from '@prisma/client';
import type { Jwks } from 'api/@types/auth';
import type { MaybeId } from 'api/@types/brandedId';
import type { UserPoolClientEntity, UserPoolEntity } from 'api/@types/userPool';
import { genJwks } from 'service/privateKey';
import { toUserPoolClientEntity, toUserPoolEntity } from './toUserPoolEntity';

export const userPoolQuery = {
  findById: (tx: Prisma.TransactionClient, userPoolId: string): Promise<UserPoolEntity> =>
    tx.userPool.findUniqueOrThrow({ where: { id: userPoolId } }).then(toUserPoolEntity),
  findJwks: (tx: Prisma.TransactionClient, userPoolId: string): Promise<Jwks> =>
    userPoolQuery.findById(tx, userPoolId).then((pool) => genJwks(pool.privateKey)),
  findClientById: (
    tx: Prisma.TransactionClient,
    poolClientId: MaybeId['userPoolClient'],
  ): Promise<UserPoolClientEntity> =>
    tx.userPoolClient
      .findUniqueOrThrow({ where: { id: poolClientId } })
      .then(toUserPoolClientEntity),
};
