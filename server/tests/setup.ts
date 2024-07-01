import { exec } from 'child_process';
import { userPoolUseCase } from 'domain/userPool/useCase/userPoolUseCase';
import type { FastifyInstance } from 'fastify';
import { init } from 'service/app';
import { PORT } from 'service/envValues';
import { prismaClient } from 'service/prismaClient';
import util from 'util';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

let server: FastifyInstance;

const unneededServer = (file: { filepath?: string } | undefined): boolean =>
  !/\/tests\/.+\.test\.ts$/.test(file?.filepath ?? '');

beforeAll(async (info) => {
  if (unneededServer(info)) return;

  server = init();
  await server.listen({ port: PORT, host: '0.0.0.0' });
});

beforeEach(async (info) => {
  if (unneededServer(info.task.file)) return;

  await util.promisify(exec)('npx prisma migrate reset --force');
  await util.promisify(exec)('npx prisma db seed');
  await userPoolUseCase.initDefaults();
});

afterEach(async (info) => {
  if (unneededServer(info.task.file)) return;

  await prismaClient.$disconnect();
});

afterAll(async (info) => {
  if (unneededServer(info)) return;

  await server.close();
});
