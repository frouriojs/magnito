import type { EntityId } from './brandedId';

export type Jwks = { keys: [{ kid: string; alg: string }] };

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
