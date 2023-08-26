import { expect, test } from 'vitest';
import { apiClient, testUser } from './apiClient';

test('API接続確認', async () => {
  const res = await apiClient.health.$get();

  expect(res.server).toEqual('ok');
  expect(res.db).toEqual('ok');
});

test('認証確認', async () => {
  const res = await apiClient.me.$get();

  expect(res.email).toBe(testUser.email);
});
