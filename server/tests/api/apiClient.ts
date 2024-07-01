import aspida from '@aspida/axios';
import { AdminDeleteUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import api from 'api/$api';
import axios from 'axios';
import { cognitoClient } from 'service/cognito';
import { COOKIE_NAME } from 'service/constants';
import { DEFAULT_USER_POOL_ID, PORT } from 'service/envValues';
import { ulid } from 'ulid';

const baseURL = `http://127.0.0.1:${PORT}`;

export const noCookieClient = api(
  aspida(undefined, { baseURL, headers: { 'Content-Type': 'text/plain' } }),
);

export const testUserName = 'test-client';

export const testPassword = 'Test-client-password1';

export const createUserClient = async (): Promise<typeof noCookieClient> => {
  const tokens = await noCookieClient.public.backdoor.$post({
    body: { username: testUserName, email: `${ulid()}@example.com`, password: testPassword },
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

export const deleteUser = async (): Promise<void> => {
  const command = new AdminDeleteUserCommand({
    UserPoolId: DEFAULT_USER_POOL_ID,
    Username: testUserName,
  });

  await cognitoClient.send(command);
};
