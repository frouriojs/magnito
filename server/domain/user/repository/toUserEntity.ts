import type { User } from '@prisma/client';
import type { UserEntity } from 'api/@types/user';
import { brandedId } from 'service/brandedId';

export const toUserEntity = (prismaUser: User): UserEntity => {
  return {
    id: brandedId.user.entity.parse(prismaUser.id),
    name: prismaUser.name,
    email: prismaUser.email,
    createdTime: prismaUser.createdAt.getTime(),
  };
};
