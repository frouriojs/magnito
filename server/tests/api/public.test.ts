import { expect, test } from 'vitest';
import { apiClient } from './apiClient';
import { GET } from './utils';

test(GET(apiClient.health), async () => {
  const res = await apiClient.health.$get();

  expect(res.server).toEqual('ok');
  expect(res.db).toEqual('ok');
  expect(res.smtp).toEqual('ok');
});
