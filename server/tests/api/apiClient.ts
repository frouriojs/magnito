import aspida from '@aspida/axios';
import api from 'api/$api';
import type { UserEntity } from 'api/@types/user';
import axios from 'axios';
import { genConfirmationCode } from 'domain/user/service/genConfirmationCode';
import { genTokens } from 'domain/user/service/genTokens';
import { brandedId } from 'service/brandedId';
import { COOKIE_NAME } from 'service/constants';
import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID, PORT } from 'service/envValues';
import { prismaClient } from 'service/prismaClient';
import { genJwks } from 'service/privateKey';
import { ulid } from 'ulid';

const baseURL = `http://127.0.0.1:${PORT}`;

export const noCookieClient = api(
  aspida(undefined, { baseURL, headers: { 'Content-Type': 'text/plain' } }),
);

export const createUserClient = async (): Promise<typeof noCookieClient> => {
  const user: UserEntity = {
    id: brandedId.user.entity.parse(ulid()),
    email: `${ulid()}@example.com`,
    name: 'test-client',
    verified: true,
    confirmationCode: genConfirmationCode(),
    salt: 'salt',
    verifier: 'verifier',
    refreshToken: ulid(),
    userPoolId: DEFAULT_USER_POOL_ID,
    createdTime: Date.now(),
  };
  await prismaClient.user.create({
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      verified: true,
      confirmationCode: genConfirmationCode(),
      salt: user.salt,
      verifier: user.verifier,
      refreshToken: user.refreshToken,
      userPoolId: DEFAULT_USER_POOL_ID,
      createdAt: new Date(user.createdTime),
    },
  });
  const pool = await prismaClient.userPool.findUniqueOrThrow({
    where: { id: DEFAULT_USER_POOL_ID },
  });
  const jwks = await genJwks(pool.privateKey);
  const { IdToken } = genTokens({
    privateKey: pool.privateKey,
    userPoolClientId: DEFAULT_USER_POOL_CLIENT_ID,
    jwks,
    user,
  });
  const agent = axios.create({
    baseURL,
    headers: { cookie: `${COOKIE_NAME}=${IdToken}`, 'Content-Type': 'text/plain' },
  });

  agent.interceptors.response.use(undefined, (err) =>
    Promise.reject(axios.isAxiosError(err) ? new Error(JSON.stringify(err.toJSON())) : err),
  );

  return api(aspida(agent));
};
