import type { Prisma } from '@prisma/client';
import type { ChallengeEntity } from 'api/@types/challenge';

export const challengeCommand = {
  save: async (tx: Prisma.TransactionClient, challenge: ChallengeEntity): Promise<void> => {
    await tx.challenge.upsert({
      where: { id: challenge.id },
      update: {},
      create: challenge,
    });
  },
  delete: async (tx: Prisma.TransactionClient, id: ChallengeEntity['id']): Promise<void> => {
    await tx.challenge.delete({ where: { id } });
  },
};
