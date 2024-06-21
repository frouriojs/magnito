import { createSigner } from 'fast-jwt';
import { COOKIE_NAME, EXPIRES_SEC } from 'service/constants';
import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID } from 'service/envValues';
import { expect, test } from 'vitest';
import { noCookieClient } from './apiClient';
import { DELETE, GET, POST } from './utils';

test(GET(noCookieClient.public), async () => {
  const res = await noCookieClient.public.$get();

  expect(res).toEqual('');
});

test(GET(noCookieClient._userPoolId('_userPoolId')), async () => {
  const res = await noCookieClient._userPoolId(DEFAULT_USER_POOL_ID).get();

  expect(res.status).toEqual(200);
});

test(GET(noCookieClient._userPoolId('_userPoolId')._well_known), async () => {
  const res = await noCookieClient._userPoolId(DEFAULT_USER_POOL_ID)._well_known.get();

  expect(res.status).toEqual(200);
});

test(GET(noCookieClient.public.health), async () => {
  const res = await noCookieClient.public.health.$get();

  expect(res.server).toEqual('ok');
  expect(res.db).toEqual('ok');
  expect(res.smtp).toEqual('ok');
});

test(GET(noCookieClient.public.defaults), async () => {
  const res = await noCookieClient.public.defaults.$get();

  expect(res.userPoolId).toBe(DEFAULT_USER_POOL_ID);
  expect(res.userPoolClientId).toBe(DEFAULT_USER_POOL_CLIENT_ID);
});

test(POST(noCookieClient.public.session), async () => {
  const jwt = createSigner({ key: 'dummy' })({ exp: Math.floor(Date.now() / 1000) + EXPIRES_SEC });
  const res = await noCookieClient.public.session.post({ body: { jwt } });

  expect(res.headers['set-cookie'][0].startsWith(`${COOKIE_NAME}=${jwt};`)).toBeTruthy();
  expect(res.body.status === 'success').toBeTruthy();
});

test(DELETE(noCookieClient.public.session), async () => {
  const res = await noCookieClient.public.session.delete();

  expect(res.headers['set-cookie'][0].startsWith(`${COOKIE_NAME}=;`)).toBeTruthy();
  expect(res.body.status === 'success').toBeTruthy();
});
