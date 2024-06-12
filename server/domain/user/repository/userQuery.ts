import type { Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { UserEntity } from 'api/@types/user';
import { toUserEntity } from './toUserEntity';

export const userQuery = {
  findById: (tx: Prisma.TransactionClient, id: EntityId['user']): Promise<UserEntity> =>
    tx.user.findUniqueOrThrow({ where: { id } }).then(toUserEntity),
  findByName: (tx: Prisma.TransactionClient, name: string): Promise<UserEntity> =>
    tx.user.findFirstOrThrow({ where: { name } }).then(toUserEntity),
  findByRefreshToken: (tx: Prisma.TransactionClient, refreshToken: string): Promise<UserEntity> =>
    tx.user.findFirstOrThrow({ where: { refreshToken } }).then(toUserEntity),
};
