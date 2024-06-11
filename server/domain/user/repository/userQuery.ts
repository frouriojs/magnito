import type { Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { UserEntity } from 'api/@types/user';
import { toUserEntity } from './toUserEntity';

export const userQuery = {
  findById: async (tx: Prisma.TransactionClient, id: EntityId['user']): Promise<UserEntity> =>
    tx.user.findUniqueOrThrow({ where: { id } }).then(toUserEntity),
};
