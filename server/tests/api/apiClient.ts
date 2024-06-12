import aspida from '@aspida/axios';
import api from 'api/$api';
import type { UserEntity } from 'api/@types/user';
import axios from 'axios';
import { createSigner } from 'fast-jwt';
import { brandedId } from 'service/brandedId';
import { COOKIE_NAME } from 'service/constants';
import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID, PORT } from 'service/envValues';
import { prismaClient } from 'service/prismaClient';
import { genJwks } from 'service/privateKey';
import type { JwtUser } from 'service/types';
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
    createdTime: Date.now(),
  };
  await prismaClient.user.create({
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      verified: true,
      userPoolId: DEFAULT_USER_POOL_ID,
      createdAt: new Date(user.createdTime),
    },
  });
  const pool = await prismaClient.userPool.findUniqueOrThrow({
    where: { id: DEFAULT_USER_POOL_ID },
  });
  const jwks = (await genJwks(pool.privateKey)) as { keys: [{ kid: string; alg: string }] };
  const signer = createSigner({
    key: pool.privateKey,
    aud: DEFAULT_USER_POOL_CLIENT_ID,
    header: { kid: jwks.keys[0].kid, alg: jwks.keys[0].alg },
  });
  const jwt: JwtUser = { sub: user.id, 'cognito:username': user.name, email: user.email };
  const agent = axios.create({
    baseURL,
    headers: { cookie: `${COOKIE_NAME}=${signer(jwt)}`, 'Content-Type': 'text/plain' },
  });

  agent.interceptors.response.use(undefined, (err) =>
    Promise.reject(axios.isAxiosError(err) ? new Error(JSON.stringify(err.toJSON())) : err),
  );

  return api(aspida(agent));
};
