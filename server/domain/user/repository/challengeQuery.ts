import type { Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { ChallengeEntity } from 'api/@types/challenge';
import { toChallengeEntity } from './toChallengeEntity';

export const challengeQuery = {
  findById: (tx: Prisma.TransactionClient, id: EntityId['challenge']): Promise<ChallengeEntity> =>
    tx.challenge.findUniqueOrThrow({ where: { id } }).then(toChallengeEntity),
  findBySecretBlock: (
    tx: Prisma.TransactionClient,
    secretBlock: string,
  ): Promise<ChallengeEntity> =>
    tx.challenge.findFirstOrThrow({ where: { secretBlock } }).then(toChallengeEntity),
};
