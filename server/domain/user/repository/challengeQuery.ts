import type { Prisma } from '@prisma/client';
import type { ChallengeEntity } from 'api/@types/challenge';
import { toChallengeEntity } from './toChallengeEntity';

export const challengeQuery = {
  findBySecretBlock: (
    tx: Prisma.TransactionClient,
    secretBlock: string,
  ): Promise<ChallengeEntity> =>
    tx.challenge.findFirstOrThrow({ where: { secretBlock } }).then(toChallengeEntity),
};
