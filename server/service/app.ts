import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import type { TokenOrHeader } from '@fastify/jwt';
import fastifyJwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import assert from 'assert';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import Fastify from 'fastify';
import buildGetJwks from 'get-jwks';
import { join } from 'path';
import server from '../$server';
import { COOKIE_NAME, JWT_PROP_NAME } from './constants';

export const init = (): FastifyInstance => {
  const fastify = Fastify();
  const getJwks = buildGetJwks();

  fastify.register(helmet);
  fastify.register(cors, { origin: true, credentials: true });
  fastify.register(cookie);
  fastify.addContentTypeParser(
    'application/x-amz-json-1.1',
    { parseAs: 'string' },
    (_, body, done) => {
      done(null, JSON.parse(body as string));
    },
  );
  fastify.register(fastifyJwt, {
    decoratorName: JWT_PROP_NAME,
    cookie: { cookieName: COOKIE_NAME, signed: false },
    decode: { complete: true },
    secret: (_: FastifyRequest, token: TokenOrHeader) => {
      assert('header' in token);

      return getJwks.getPublicKey({
        kid: token.header.kid,
        domain: token.payload.iss,
        alg: token.header.alg,
      });
    },
  });

  server(fastify);

  return fastify;
};

export const serveClient = (): FastifyInstance => {
  const fastify = Fastify();
  fastify.register(fastifyStatic, { root: join(process.cwd(), '../client/out') });

  return fastify;
};
