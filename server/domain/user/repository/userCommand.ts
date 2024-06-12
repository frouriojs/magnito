import type { Prisma } from '@prisma/client';
import type { UserEntity } from 'api/@types/user';

export const userCommand = {
  save: async (tx: Prisma.TransactionClient, user: UserEntity): Promise<void> => {
    await tx.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        name: user.name,
        verified: user.verified,
        refreshToken: user.refreshToken,
        confirmationCode: user.confirmationCode,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        verified: user.verified,
        refreshToken: user.refreshToken,
        confirmationCode: user.confirmationCode,
        userPoolId: user.userPoolId,
        createdAt: new Date(user.createdTime),
      },
    });
  },
};
