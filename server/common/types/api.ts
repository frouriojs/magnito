import type { EntityId } from './brandedId';

export type DefaultConfigs = {
  userPoolId: EntityId['userPool'];
  userPoolClientId: EntityId['userPoolClient'];
  region: string;
  accessKey: string;
  secretKey: string;
  oauthDomain: string;
};
