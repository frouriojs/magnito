import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID } from 'service/envValues';
import { expect, test } from 'vitest';
import { noCookieClient } from './apiClient';
import { GET } from './utils';

test(GET(noCookieClient.health), async () => {
  const res = await noCookieClient.health.$get();

  expect(res.server).toEqual('ok');
  expect(res.db).toEqual('ok');
  expect(res.smtp).toEqual('ok');
});

test(GET(noCookieClient.defaults), async () => {
  const res = await noCookieClient.defaults.$get();

  expect(res.userPoolId).toBe(DEFAULT_USER_POOL_ID);
  expect(res.userPoolClientId).toBe(DEFAULT_USER_POOL_CLIENT_ID);
});
