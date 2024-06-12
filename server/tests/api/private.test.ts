import { expect, test } from 'vitest';
import { createUserClient, noCookieClient } from './apiClient';
import { GET } from './utils';

test(GET(noCookieClient.private), async () => {
  const userClient = await createUserClient();
  const res = await userClient.private.$get();

  expect(res).toEqual('');
});
