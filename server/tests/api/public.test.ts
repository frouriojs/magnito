import { COOKIE_NAME } from 'service/constants';
import { expect, test } from 'vitest';
import { apiClient } from './apiClient';
import { DELETE, GET } from './utils';

test(GET(apiClient), async () => {
  const res = await apiClient.$get();

  expect(res).toEqual('');
});

test(GET(apiClient.health), async () => {
  const res = await apiClient.health.$get();

  expect(res.server).toEqual('ok');
  expect(res.db).toEqual('ok');
});

test(DELETE(apiClient.session), async () => {
  const res = await apiClient.session.delete();

  expect(res.headers['set-cookie'][0].startsWith(`${COOKIE_NAME}=;`)).toBeTruthy();
  expect(res.body.status === 'success').toBeTruthy();
});
