import type { Challenge } from '@prisma/client';
import type { ChallengeEntity } from 'api/@types/challenge';
import { brandedId } from 'service/brandedId';

export const toChallengeEntity = (prismaChallenge: Challenge): ChallengeEntity => {
  return {
    id: brandedId.challenge.entity.parse(prismaChallenge.id),
    secretBlock: prismaChallenge.secretBlock,
    pubA: prismaChallenge.pubA,
    pubB: prismaChallenge.pubB,
    secB: prismaChallenge.secB,
  };
};
