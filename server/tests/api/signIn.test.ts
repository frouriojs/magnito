import assert from 'assert';
import { DEFAULT_USER_POOL_CLIENT_ID } from 'service/envValues';
import { expect, test } from 'vitest';
import { createUserClient, noCookieClient } from './apiClient';

test('signIn', async () => {
  await createUserClient();
  await noCookieClient.$post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.InitiateAuth' },
    body: {
      AuthFlow: 'USER_SRP_AUTH',
      AuthParameters: { USERNAME: 'test-client', SRP_A: 'string' },
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  const res1 = await noCookieClient.$post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.RespondToAuthChallenge' },
    body: {
      ChallengeName: 'PASSWORD_VERIFIER',
      ChallengeResponses: {
        PASSWORD_CLAIM_SECRET_BLOCK: 'string',
        PASSWORD_CLAIM_SIGNATURE: 'string',
        TIMESTAMP: 'string',
        USERNAME: 'test-client',
      },
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  assert('AuthenticationResult' in res1);
  assert('RefreshToken' in res1.AuthenticationResult);

  await noCookieClient.$post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.GetUser' },
    body: { AccessToken: res1.AuthenticationResult.AccessToken },
  });

  await noCookieClient.post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.InitiateAuth' },
    body: {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: { REFRESH_TOKEN: res1.AuthenticationResult.RefreshToken },
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  const res2 = await noCookieClient.post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.RevokeToken' },
    body: {
      Token: res1.AuthenticationResult.RefreshToken,
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  expect(res2.status).toBe(200);
});
