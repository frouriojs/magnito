import { expect, test } from 'vitest';
import { createUserClient, deleteUser, noCookieClient } from './apiClient';
import { GET } from './utils';

test(GET(noCookieClient.private), async () => {
  const userClient = await createUserClient();
  const res = await userClient.private.$get();

  expect(res).toEqual('');

  await expect(noCookieClient.private.get()).rejects.toHaveProperty('response.status', 401);
  await deleteUser();
});

test(GET(noCookieClient.private.me), async () => {
  const userClient = await createUserClient();
  const res = await userClient.private.me.get();

  expect(res.status).toBe(200);

  await deleteUser();
});
