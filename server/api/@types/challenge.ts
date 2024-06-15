import type { EntityId } from './brandedId';

export type ChallengeEntity = {
  id: EntityId['challenge'];
  secretBlock: string;
  pubA: string;
  pubB: string;
  secB: string;
};
