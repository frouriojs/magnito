import { taskQuery } from 'domain/task/repository/taskQuery';
import { taskValidator } from 'domain/task/service/taskValidator';
import { taskUseCase } from 'domain/task/useCase/taskUseCase';
import { taskIdParser } from 'service/idParsers';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: taskQuery.findMany() }),
  post: {
    validators: { body: taskValidator.taskCreate },
    handler: ({ body }) => ({ status: 201, body: taskUseCase.create(body) }),
  },
  patch: {
    validators: { body: taskValidator.taskUpdate },
    handler: ({ body }) => ({ status: 204, body: taskUseCase.update(body) }),
  },
  delete: {
    validators: { body: z.object({ taskId: taskIdParser }) },
    handler: ({ body }) => ({ status: 204, body: taskUseCase.delete(body.taskId) }),
  },
}));
