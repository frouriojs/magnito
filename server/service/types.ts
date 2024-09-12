import type { EntityId } from 'common/types/brandedId';

export type IdTokenJwt = {
  sub: EntityId['cognitoUser'];
  email_verified: boolean;
  iss: string;
  'cognito:username': string;
  origin_jti: string;
  aud: EntityId['userPoolClient'];
  event_id: string;
  token_use: 'id';
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  email: string;
};

export type AccessTokenJwt = {
  sub: EntityId['cognitoUser'];
  iss: string;
  client_id: EntityId['userPoolClient'];
  origin_jti: string;
  event_id: string;
  token_use: 'access';
  scope: 'aws.cognito.signin.user.admin';
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
};
