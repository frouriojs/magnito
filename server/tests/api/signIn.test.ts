import assert from 'assert';
import { calcClientSignature } from 'domain/user/service/srp/calcClientSignature';
import { calculateSrpA } from 'domain/user/service/srp/calcSrpA';
import { fromBuffer } from 'domain/user/service/srp/util';
import { DEFAULT_USER_POOL_CLIENT_ID } from 'service/envValues';
import { expect, test } from 'vitest';
import { createUserClient, noCookieClient, testPassword, testUserName } from './apiClient';

test('signIn', async () => {
  await createUserClient();

  const { a, A } = calculateSrpA();
  const res1 = await noCookieClient.$post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.InitiateAuth' },
    body: {
      AuthFlow: 'USER_SRP_AUTH',
      AuthParameters: { USERNAME: testUserName, SRP_A: A.toString('hex') },
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  assert('ChallengeParameters' in res1);
  assert(res1.ChallengeParameters);
  const secretBlock = res1.ChallengeParameters.SECRET_BLOCK;
  const signature = calcClientSignature({
    secretBlock,
    username: testUserName,
    password: testPassword,
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
        USERNAME: testUserName,
      },
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  assert('AuthenticationResult' in res2);
  assert(res2.AuthenticationResult);
  assert(res2.AuthenticationResult.AccessToken);
  assert('RefreshToken' in res2.AuthenticationResult);
  assert(res2.AuthenticationResult.RefreshToken);

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
});
