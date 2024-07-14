import aspida from '@aspida/axios';
import {
  AdminCreateUserCommand,
  AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import api from 'api/$api';
import axios from 'axios';
import { cognitoClient } from 'service/cognito';
import { COOKIE_NAME } from 'service/constants';
import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID, PORT } from 'service/envValues';
import { ulid } from 'ulid';

const baseURL = `http://127.0.0.1:${PORT}`;

export const noCookieClient = api(
  aspida(undefined, { baseURL, headers: { 'Content-Type': 'text/plain' } }),
);

export const testUserName = 'test-user';

export const testPassword = 'Test-user-password1';

export const createUserClient = async (): Promise<typeof noCookieClient> => {
  await cognitoClient.send(
    new AdminCreateUserCommand({
      UserPoolId: DEFAULT_USER_POOL_ID,
      Username: testUserName,
      TemporaryPassword: testPassword,
      UserAttributes: [{ Name: 'email', Value: `${ulid()}@example.com` }],
    }),
  );

  const res = await cognitoClient.send(
    new AdminInitiateAuthCommand({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: DEFAULT_USER_POOL_ID,
      ClientId: DEFAULT_USER_POOL_CLIENT_ID,
      AuthParameters: { USERNAME: testUserName, PASSWORD: testPassword },
    }),
  );

  const agent = axios.create({
    baseURL,
    headers: {
      cookie: `${COOKIE_NAME}=${res.AuthenticationResult?.IdToken}`,
      'Content-Type': 'text/plain',
    },
  });

  agent.interceptors.response.use(undefined, (err) =>
    Promise.reject(axios.isAxiosError(err) ? new Error(JSON.stringify(err.toJSON())) : err),
  );

  return api(aspida(agent));
};
