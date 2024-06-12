import type { Jwks } from 'api/@types/auth';
import type { EntityId } from 'api/@types/brandedId';
import type { UserEntity } from 'api/@types/user';
import { createSigner } from 'fast-jwt';
import { PORT } from 'service/envValues';
import type { AccessTokenJwt, IdTokenJwt } from 'service/types';
import { ulid } from 'ulid';

export const genTokens = (params: {
  privateKey: string;
  userPoolClientId: EntityId['userPoolClient'];
  jwks: Jwks;
  user: UserEntity;
}): { AccessToken: string; IdToken: string } => {
  const signer = createSigner({
    key: params.privateKey,
    aud: params.userPoolClientId,
    header: { kid: params.jwks.keys[0].kid, alg: params.jwks.keys[0].alg },
  });
  const now = Date.now();
  const comomn = {
    sub: params.user.id,
    iss: `http://localhost:${PORT}/${params.user.userPoolId}`,
    origin_jti: ulid(),
    event_id: ulid(),
    auth_time: now,
    exp: now + 3600 * 1000,
    iat: now,
    jti: ulid(),
  };

  const accessToken: AccessTokenJwt = {
    ...comomn,
    client_id: params.userPoolClientId,
    token_use: 'access',
    scope: 'aws.cognito.signin.user.admin',
    username: params.user.name,
  };
  const idToken: IdTokenJwt = {
    ...comomn,
    email_verified: params.user.verified,
    'cognito:username': params.user.name,
    aud: params.userPoolClientId,
    token_use: 'id',
    email: params.user.email,
  };

  return { AccessToken: signer(accessToken), IdToken: signer(idToken) };
};
