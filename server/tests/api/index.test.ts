import { API_BASE_PATH, PORT } from '$/service/envValues';
import aspida from '@aspida/node-fetch';
import { expect, test } from 'vitest';
import api from '../../api/$api';

const apiClient = api(
  aspida(undefined, { baseURL: `http://127.0.0.1:${PORT}${API_BASE_PATH}`, throwHttpErrors: true })
);

test('API接続確認', async () => {
  const res = await apiClient.health.$get();
  expect(res.server).toEqual('ok');
  expect(res.db).toEqual('ok');
});
