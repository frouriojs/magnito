import { expect, test } from 'vitest';
import { apiClient, testUser } from '../apiClient';

test('認証確認', async () => {
  const res = await apiClient.private.me.$get();

  expect(res.email).toBe(testUser.email);
});
