import type { Prisma } from '@prisma/client';
import type { EntityId } from 'common/types/brandedId';
import type { CognitoUserEntity } from 'common/types/user';
import { toUserEntity } from './toUserEntity';

export const userQuery = {
  countId: (tx: Prisma.TransactionClient, id: string): Promise<number> =>
    tx.user.count({ where: { id } }),
  listByPoolId: (tx: Prisma.TransactionClient, userPoolId: string): Promise<CognitoUserEntity[]> =>
    tx.user
      .findMany({ where: { userPoolId }, include: { attributes: true } })
      .then((users) => users.map(toUserEntity)),
  findById: (
    tx: Prisma.TransactionClient,
    id: EntityId['cognitoUser'],
  ): Promise<CognitoUserEntity> =>
    tx.user.findUniqueOrThrow({ where: { id }, include: { attributes: true } }).then(toUserEntity),
  findByName: (tx: Prisma.TransactionClient, name: string): Promise<CognitoUserEntity> =>
    tx.user.findFirstOrThrow({ where: { name }, include: { attributes: true } }).then(toUserEntity),
  findByRefreshToken: (
    tx: Prisma.TransactionClient,
    refreshToken: string,
  ): Promise<CognitoUserEntity> =>
    tx.user
      .findFirstOrThrow({ where: { refreshToken }, include: { attributes: true } })
      .then(toUserEntity),
};
