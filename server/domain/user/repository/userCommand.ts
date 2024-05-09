import type { Prisma } from '@prisma/client';
import type { UserEntity } from 'api/@types/user';

export const userCommand = {
  save: async (tx: Prisma.TransactionClient, user: UserEntity): Promise<void> => {
    await tx.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(user.createdTime),
      },
    });
  },
};
