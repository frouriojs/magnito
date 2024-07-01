import type { Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { UserEntity } from 'api/@types/user';

export const userCommand = {
  save: async (tx: Prisma.TransactionClient, user: UserEntity): Promise<void> => {
    await tx.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        name: user.name,
        verified: user.verified,
        salt: user.salt,
        verifier: user.verifier,
        refreshToken: user.refreshToken,
        confirmationCode: user.confirmationCode,
        secretBlock: user.challenge?.secretBlock,
        pubA: user.challenge?.pubA,
        pubB: user.challenge?.pubB,
        secB: user.challenge?.secB,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        verified: user.verified,
        salt: user.salt,
        verifier: user.verifier,
        refreshToken: user.refreshToken,
        confirmationCode: user.confirmationCode,
        userPoolId: user.userPoolId,
        createdAt: new Date(user.createdTime),
      },
    });
  },
  delete: async (
    tx: Prisma.TransactionClient,
    deletableUserId: EntityId['deletableUser'],
  ): Promise<void> => {
    await tx.user.delete({ where: { id: deletableUserId } });
  },
};
