import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { COOKIE_NAME } from 'service/constants';
import { PORT } from 'service/envValues';

const baseURL = `http://127.0.0.1:${PORT}`;

export const noCookieClient = api(
  aspida(undefined, { baseURL, headers: { 'Content-Type': 'text/plain' } }),
);

export const testUserName = 'test-user';

export const testPassword = 'Test-user-password1';

export const createUserClient = async (token: {
  AccessToken: string;
}): Promise<typeof noCookieClient> => {
  const agent = axios.create({
    baseURL,
    headers: { cookie: `${COOKIE_NAME}=${token.AccessToken}`, 'Content-Type': 'text/plain' },
  });

  agent.interceptors.response.use(undefined, (err) =>
    Promise.reject(axios.isAxiosError(err) ? new Error(JSON.stringify(err.toJSON())) : err),
  );

  return api(aspida(agent));
};
