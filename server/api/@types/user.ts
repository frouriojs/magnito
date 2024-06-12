import type { EntityId } from './brandedId';

export type UserEntity = {
  id: EntityId['user'];
  name: string;
  email: string;
  verified: boolean;
  confirmationCode: string;
  refreshToken: string;
  userPoolId: EntityId['userPool'];
  createdTime: number;
};
