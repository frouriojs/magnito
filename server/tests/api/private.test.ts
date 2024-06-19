import { expect, test } from 'vitest';
import { createUserClient, noCookieClient } from './apiClient';
import { GET } from './utils';

test(GET(noCookieClient.private), async () => {
  const userClient = await createUserClient();
  const res = await userClient.private.$get();

  expect(res).toEqual('');

  await expect(noCookieClient.private.get()).rejects.toHaveProperty('response.status', 401);
  await userClient.private.backdoor.$delete();
});

test(GET(noCookieClient.private.me), async () => {
  const userClient = await createUserClient();
  const res = await userClient.private.me.get();

  expect(res.status).toBe(200);
  await userClient.private.backdoor.$delete();
});
