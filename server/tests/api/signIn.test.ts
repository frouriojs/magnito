import type { RespondToAuthChallengeTarget } from 'api/@types/auth';
import { DEFAULT_USER_POOL_CLIENT_ID } from 'service/envValues';
import { expect, test } from 'vitest';
import { noCookieClient } from './apiClient';

test('signIn', async () => {
  await noCookieClient.$post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.InitiateAuth' },
    body: {
      AuthFlow: 'USER_SRP_AUTH',
      AuthParameters: { USERNAME: 'user', SRP_A: 'string' },
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  const res2 = (await noCookieClient.$post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.RespondToAuthChallenge' },
    body: {
      ChallengeName: 'PASSWORD_VERIFIER',
      ChallengeResponses: {
        PASSWORD_CLAIM_SECRET_BLOCK: 'string',
        PASSWORD_CLAIM_SIGNATURE: 'string',
        TIMESTAMP: 'string',
        USERNAME: 'user',
      },
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  })) as unknown as RespondToAuthChallengeTarget['resBody'];

  const res3 = await noCookieClient.$post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.GetUser' },
    body: { AccessToken: res2.AuthenticationResult.AccessToken },
  });

  expect(res3).toHaveProperty('UserAttributes');
});
