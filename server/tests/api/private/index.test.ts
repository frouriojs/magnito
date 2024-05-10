import { expect, test } from 'vitest';
import { apiClient, noCookieClient, testUser } from '../apiClient';
import { GET } from '../utils';

test(GET(apiClient.private), async () => {
  const res = await apiClient.private.$get();

  expect(res).toEqual('');

  await expect(noCookieClient.private.get()).rejects.toHaveProperty('response.status', 401);
});

test(GET(apiClient.private.me), async () => {
  const res = await apiClient.private.me.$get();

  expect(res.email).toEqual(testUser.email);
});
