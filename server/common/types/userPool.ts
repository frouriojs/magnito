import type { EntityId } from './brandedId';

export type Jwks = { keys: [{ kid: string; alg: string }] };

export type UserPoolEntity = {
  id: EntityId['userPool'];
  name: string;
  privateKey: string;
  createdTime: number;
};

export type UserPoolClientEntity = {
  id: EntityId['userPoolClient'];
  userPoolId: EntityId['userPool'];
  name: string;
  createdTime: number;
};
