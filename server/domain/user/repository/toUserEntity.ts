import type { User } from '@prisma/client';
import type { UserEntity } from 'common/types/user';
import { brandedId } from 'service/brandedId';

const getChallenge = (prismaUser: User): UserEntity['challenge'] =>
  prismaUser.secretBlock && prismaUser.pubA && prismaUser.pubB && prismaUser.secB
    ? {
        secretBlock: prismaUser.secretBlock,
        pubA: prismaUser.pubA,
        pubB: prismaUser.pubB,
        secB: prismaUser.secB,
      }
    : undefined;

export const toUserEntity = (prismaUser: User): UserEntity => {
  return {
    id: brandedId.user.entity.parse(prismaUser.id),
    name: prismaUser.name,
    email: prismaUser.email,
    password: prismaUser.password,
    salt: prismaUser.salt,
    verifier: prismaUser.verifier,
    refreshToken: prismaUser.refreshToken,
    verified: prismaUser.verified,
    confirmationCode: prismaUser.confirmationCode,
    challenge: getChallenge(prismaUser),
    userPoolId: brandedId.userPool.entity.parse(prismaUser.userPoolId),
    createdTime: prismaUser.createdAt.getTime(),
  };
};
