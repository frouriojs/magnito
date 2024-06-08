import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import { join } from 'path';
import { CORS_ORIGIN } from 'service/envValues';
import server from '../$server';

export const init = (): FastifyInstance => {
  const fastify = Fastify();
  fastify.register(helmet);
  fastify.register(cors, { origin: CORS_ORIGIN, credentials: true });
  fastify.register(cookie);
  fastify.addContentTypeParser(
    'application/x-amz-json-1.1',
    { parseAs: 'string' },
    (_, body, done) => {
      done(null, JSON.parse(body as string));
    },
  );

  server(fastify);

  return fastify;
};

export const serveClient = (): FastifyInstance => {
  const fastify = Fastify();
  fastify.register(fastifyStatic, { root: join(process.cwd(), '../client/out') });

  return fastify;
};
