import type { Prisma } from '@prisma/client';
import type { UserId } from 'api/@types/brandedId';
import type { TaskEntity } from 'api/@types/task';
import type { UserEntity } from 'api/@types/user';
import controller from 'api/private/tasks/di/controller';
import fastify from 'fastify';
import { taskIdParser } from 'service/idParsers';
import { expect, test } from 'vitest';
import { apiClient, testUser } from './apiClient';

test('API接続確認', async () => {
  const res = await apiClient.health.$get();

  expect(res.server).toEqual('ok');
  expect(res.db).toEqual('ok');
});

test('認証確認', async () => {
  const res = await apiClient.private.me.$get();

  expect(res.email).toBe(testUser.email);
});

test('依存性注入', async () => {
  const res1 = await controller(fastify()).get({
    user: { id: 'dummy-userId' } as UserEntity,
  });

  expect(res1.body).toHaveLength(0);

  const mockedFindManyTask = async (
    _: Prisma.TransactionClient,
    authorId: UserId,
  ): Promise<TaskEntity[]> => [
    {
      id: taskIdParser.parse('foo'),
      label: 'baz',
      done: false,
      createdTime: Date.now(),
      author: { id: authorId, displayName: undefined },
    },
  ];

  const res2 = await controller
    .inject({ findManyByAuthorId: mockedFindManyTask })(fastify())
    .get({ user: { id: 'dummy-userId' } as UserEntity });

  expect(res2.body).toHaveLength(1);
});
