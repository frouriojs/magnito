import type { EntityId } from './brandedId';

export type ChallengeVal = {
  secretBlock: string;
  pubA: string;
  pubB: string;
  secB: string;
};

export type UserEntity = {
  id: EntityId['user'];
  name: string;
  email: string;
  password: string;
  verified: boolean;
  confirmationCode: string;
  salt: string;
  verifier: string;
  refreshToken: string;
  userPoolId: EntityId['userPool'];
  createdTime: number;
  challenge?: ChallengeVal;
};
