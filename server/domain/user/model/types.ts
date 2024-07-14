import type { EntityId } from 'common/types/brandedId';

export type CreateUserVal = {
  name: string;
  password: string;
  email: string;
  userPoolId: EntityId['userPool'];
};
