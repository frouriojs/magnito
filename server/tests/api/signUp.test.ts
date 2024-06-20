import assert from 'assert';
import { InbucketAPIClient } from 'inbucket-js-client';
import { DEFAULT_USER_POOL_CLIENT_ID } from 'service/envValues';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';
import { noCookieClient } from './apiClient';

test('signUp', async () => {
  const email = `${ulid()}@example.com`;

  await noCookieClient.post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.SignUp' },
    body: {
      Username: 'user',
      Password: 'Test-client-password1',
      UserAttributes: [{ Name: 'email', Value: email }],
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  assert(process.env.INBUCKET_URL);

  const inbucketClient = new InbucketAPIClient(process.env.INBUCKET_URL);
  const inbox = await inbucketClient.mailbox(email);
  const message = await inbucketClient.message(email, inbox[0].id);
  const res = await noCookieClient.post({
    headers: { 'x-amz-target': 'AWSCognitoIdentityProviderService.ConfirmSignUp' },
    body: {
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
      ConfirmationCode: message.body.text.trim().split(' ').at(-1) ?? '',
      Username: 'user',
    },
  });

  await inbucketClient.deleteMessage(email, inbox[0].id);

  expect(res.status).toBe(200);
});
