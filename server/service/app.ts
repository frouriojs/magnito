import server from '$server';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import type { FastifyInstance, FastifyServerFactory } from 'fastify';
import Fastify from 'fastify';
import { CORS_ORIGIN } from 'service/envValues';

export const init = (serverFactory?: FastifyServerFactory): FastifyInstance => {
  const app = Fastify({ serverFactory });
  app.register(helmet);
  app.register(cors, { origin: CORS_ORIGIN, credentials: true });
  app.register(cookie);
  app.addContentTypeParser('application/x-amz-json-1.1', { parseAs: 'string' }, (_, body, done) => {
    done(null, JSON.parse(body as string));
  });

  server(app);

  return app;
};
