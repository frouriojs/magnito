import assert from 'assert';
import crypto from 'crypto';
import { calcClientSignature } from 'domain/user/service/srp/calcClientSignature';
import { N, g } from 'domain/user/service/srp/constants';
import { fromBuffer, toBuffer } from 'domain/user/service/srp/util';
import { DEFAULT_USER_POOL_CLIENT_ID } from 'service/envValues';
import { expect, test } from 'vitest';
import { createUserClient, noCookieClient } from './apiClient';

test('signIn', async () => {
  const userClient = await createUserClient();
  const a = crypto.randomBytes(32);
  const A = toBuffer(g.modPow(fromBuffer(a), N));
  const res1 = await noCookieClient.$post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.InitiateAuth' },
    body: {
      AuthFlow: 'USER_SRP_AUTH',
      AuthParameters: { USERNAME: 'test-client', SRP_A: A.toString('hex') },
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  assert('ChallengeParameters' in res1);
  const secretBlock = res1.ChallengeParameters.SECRET_BLOCK;
  const signature = calcClientSignature({
    secretBlock,
    username: 'test-client',
    password: 'test-client-password',
    salt: res1.ChallengeParameters.SALT,
    timestamp: 'Thu Jan 01 00:00:00 UTC 1970',
    A: A.toString('hex'),
    a: fromBuffer(a),
    B: res1.ChallengeParameters.SRP_B,
  });

  const res2 = await noCookieClient.$post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.RespondToAuthChallenge' },
    body: {
      ChallengeName: 'PASSWORD_VERIFIER',
      ChallengeResponses: {
        PASSWORD_CLAIM_SECRET_BLOCK: secretBlock,
        PASSWORD_CLAIM_SIGNATURE: signature,
        TIMESTAMP: 'Thu Jan 01 00:00:00 UTC 1970',
        USERNAME: 'test-client',
      },
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  assert('AuthenticationResult' in res2);
  assert('RefreshToken' in res2.AuthenticationResult);

  await noCookieClient.$post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.GetUser' },
    body: { AccessToken: res2.AuthenticationResult.AccessToken },
  });

  await noCookieClient.post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.InitiateAuth' },
    body: {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: { REFRESH_TOKEN: res2.AuthenticationResult.RefreshToken },
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  const res3 = await noCookieClient.post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.RevokeToken' },
    body: {
      Token: res2.AuthenticationResult.RefreshToken,
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  expect(res3.status).toBe(200);

  await userClient.private.backdoor.$delete();
});
