import { taskQuery } from 'domain/task/repository/taskQuery';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController({ findManyByAuthorId: taskQuery.findManyByAuthorId }, (deps) => ({
  get: async ({ user }) => ({
    status: 200,
    body: await taskQuery.findManyWithDI.inject(deps)(prismaClient, user.id),
  }),
}));
