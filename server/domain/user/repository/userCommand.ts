import type { Prisma } from '@prisma/client';
import type { UserEntity } from 'api/@types/user';
import { DEFAULT_USER_POOL_ID } from 'service/envValues';

export const userCommand = {
  save: async (tx: Prisma.TransactionClient, user: UserEntity): Promise<void> => {
    await tx.user.upsert({
      where: { id: user.id },
      update: { email: user.email, name: user.name },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        verified: false,
        userPoolId: DEFAULT_USER_POOL_ID,
        createdAt: new Date(user.createdTime),
      },
    });
  },
};
