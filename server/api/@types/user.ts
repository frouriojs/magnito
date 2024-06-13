import type { EntityId } from './brandedId';

export type UserEntity = {
  id: EntityId['user'];
  name: string;
  email: string;
  verified: boolean;
  confirmationCode: string;
  salt: string;
  verifier: string;
  refreshToken: string;
  userPoolId: EntityId['userPool'];
  createdTime: number;
};
