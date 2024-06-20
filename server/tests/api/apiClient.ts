import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { COOKIE_NAME } from 'service/constants';
import { PORT } from 'service/envValues';
import { ulid } from 'ulid';

const baseURL = `http://127.0.0.1:${PORT}`;

export const noCookieClient = api(
  aspida(undefined, { baseURL, headers: { 'Content-Type': 'text/plain' } }),
);

export const createUserClient = async (): Promise<typeof noCookieClient> => {
  const tokens = await noCookieClient.public.backdoor.$post({
    body: {
      username: 'test-client',
      email: `${ulid()}@example.com`,
      password: 'Test-client-password1',
    },
  });
  const agent = axios.create({
    baseURL,
    headers: { cookie: `${COOKIE_NAME}=${tokens.IdToken}`, 'Content-Type': 'text/plain' },
  });

  agent.interceptors.response.use(undefined, (err) =>
    Promise.reject(axios.isAxiosError(err) ? new Error(JSON.stringify(err.toJSON())) : err),
  );

  return api(aspida(agent));
};
