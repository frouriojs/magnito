import { COOKIE_NAME } from 'service/constants';
import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID } from 'service/envValues';
import { expect, test } from 'vitest';
import { noCookieClient } from './apiClient';
import { GET, POST } from './utils';

test(GET(noCookieClient._userPoolId('_userPoolId')), async () => {
  const res = await noCookieClient._userPoolId(DEFAULT_USER_POOL_ID).get();

  expect(res.status).toEqual(200);
});

test(GET(noCookieClient._userPoolId('_userPoolId')._well_known), async () => {
  const res = await noCookieClient._userPoolId(DEFAULT_USER_POOL_ID)._well_known.get();

  expect(res.status).toEqual(200);
});

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

test(POST(noCookieClient.session), async () => {
  const jwt = 'dummy-jwt';
  const res = await noCookieClient.session.post({ body: { jwt } });

  expect(res.headers['set-cookie'][0].startsWith(`${COOKIE_NAME}=${jwt};`)).toBeTruthy();
  expect(res.body.status === 'success').toBeTruthy();
});

test(POST(noCookieClient.session.delete), async () => {
  const res = await noCookieClient.session.delete.post();

  expect(res.headers['set-cookie'][0].startsWith(`${COOKIE_NAME}=;`)).toBeTruthy();
  expect(res.body.status === 'success').toBeTruthy();
});
