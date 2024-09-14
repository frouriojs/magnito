import { createHash } from 'crypto';
import { DEFAULT_USER_POOL_CLIENT_ID } from 'service/envValues';
import { ulid } from 'ulid';
import { expect, test } from 'vitest';
import { noCookieClient } from './apiClient';
import { GET, POST } from './utils';

test(POST(noCookieClient.public.socialUsers), async () => {
  const name1 = 'user1';
  const email1 = `${ulid()}@example.com`;

  await noCookieClient.public.socialUsers.$post({
    body: {
      provider: 'Google',
      name: name1,
      email: email1,
      codeChallenge: createHash('sha256').update(ulid()).digest('base64url'),
      userPoolClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  const name2 = 'user2';
  const email2 = `${ulid()}@example.com`;
  const photoUrl = `https://example.com/${ulid()}.png`;

  await noCookieClient.public.socialUsers.$post({
    body: {
      provider: 'Amazon',
      name: name2,
      email: email2,
      codeChallenge: createHash('sha256').update(ulid()).digest('base64url'),
      photoUrl,
      userPoolClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  const res = await noCookieClient.public.socialUsers.$get({
    query: { userPoolClientId: DEFAULT_USER_POOL_CLIENT_ID },
  });

  expect(res).toHaveLength(2);
});

test(GET(noCookieClient.oauth2), async () => {
  const res = await noCookieClient.oauth2.get();

  expect(res.status === 200).toBeTruthy();
});

test(POST(noCookieClient.oauth2.token), async () => {
  const name1 = 'user1';
  const email1 = `${ulid()}@example.com`;
  const codeVerifier = ulid();
  const user = await noCookieClient.public.socialUsers.$post({
    body: {
      provider: 'Google',
      name: name1,
      email: email1,
      codeChallenge: createHash('sha256').update(codeVerifier).digest('base64url'),
      userPoolClientId: DEFAULT_USER_POOL_CLIENT_ID,
    },
  });

  const res = await noCookieClient.oauth2.token.post({
    body: {
      grant_type: 'authorization_code',
      code: user.authorizationCode,
      client_id: DEFAULT_USER_POOL_CLIENT_ID,
      redirect_uri: 'https://example.com',
      code_verifier: codeVerifier,
    },
  });

  expect(res.status === 200).toBeTruthy();
});
