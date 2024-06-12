import type { EntityId } from './brandedId';

export type UserPoolEntity = {
  id: EntityId['userPool'];
  privateKey: string;
  createdTime: number;
};

export type UserPoolClientEntity = {
  id: EntityId['userPoolClient'];
  userPoolId: EntityId['userPool'];
  createdTime: number;
};
