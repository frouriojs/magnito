import type { ChallengeEntity } from 'api/@types/challenge';
import { brandedId } from 'service/brandedId';

export const challengeMethod = {
  createChallenge: (val: {
    secretBlock: string;
    pubA: string;
    pubB: string;
    secB: string;
  }): ChallengeEntity => ({
    id: brandedId.challenge.entity.parse(val.secretBlock),
    secretBlock: val.secretBlock,
    pubA: val.pubA,
    pubB: val.pubB,
    secB: val.secB,
  }),
};
