import { DEFAULT_USER_POOL_CLIENT_ID } from 'service/envValues';
import { expect, test } from 'vitest';
import { noCookieClient } from './apiClient';

test('SignUp', async () => {
  const res = await noCookieClient.post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.SignUp' },
    body: {
      Username: 'user',
      Password: 'pass',
      UserAttributes: [{ Name: 'email', Value: 'aa@example.com' }],
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  expect(res.status).toBe(200);
});