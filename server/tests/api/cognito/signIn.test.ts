import { expect, test } from 'vitest';
import { apiClient } from '../apiClient';

test('SrpAuth', async () => {
  const res = await apiClient.$post({
    body: {
      AuthFlow: 'USER_SRP_AUTH',
      AuthParameters: { USERNAME: 'user', SRP_A: 'string' },
      ClientId: 'user',
    },
  });

  expect(res).toHaveProperty('ChallengeName');
});

test('PasswordVerifier', async () => {
  const res = await apiClient.$post({
    body: {
      ChallengeName: 'PASSWORD_VERIFIER',
      ChallengeResponses: {
        PASSWORD_CLAIM_SECRET_BLOCK: 'string',
        PASSWORD_CLAIM_SIGNATURE: 'string',
        TIMESTAMP: 'string',
        USERNAME: 'user',
      },
      ClientId: 'string',
    },
  });

  expect(res).toHaveProperty('AuthenticationResult');
});

test('Attributes', async () => {
  const res = await apiClient.$post({
    body: { AccessToken: 'string' },
  });

  expect(res).toHaveProperty('UserAttributes');
});
