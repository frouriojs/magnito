import type { User } from '@prisma/client';
import type { UserEntity } from 'api/@types/user';
import { brandedId } from 'service/brandedId';

export const toUserEntity = (prismaUser: User): UserEntity => {
  return {
    id: brandedId.user.entity.parse(prismaUser.id),
    name: prismaUser.name,
    email: prismaUser.email,
    refreshToken: prismaUser.refreshToken,
    verified: prismaUser.verified,
    confirmationCode: prismaUser.confirmationCode,
    userPoolId: brandedId.userPool.entity.parse(prismaUser.userPoolId),
    createdTime: prismaUser.createdAt.getTime(),
  };
};
