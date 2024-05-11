import type { FastifyInstance } from 'fastify';
import { init } from 'service/app';
import { PORT } from 'service/envValues';
import { afterAll, beforeAll } from 'vitest';

let server: FastifyInstance;

const unneededServer = (file: { filepath?: string } | undefined): boolean =>
  !/\/tests\/api\/.+\.test\.ts$/.test(file?.filepath ?? '');

beforeAll(async (info) => {
  if (unneededServer(info)) return;

  server = init();
  await server.listen({ port: PORT, host: '0.0.0.0' });
});

afterAll(async (info) => {
  if (unneededServer(info)) return;

  await server.close();
});
