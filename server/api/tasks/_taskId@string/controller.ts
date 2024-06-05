import { taskUseCase } from 'domain/task/useCase/taskUseCase';
import { taskIdParser } from 'service/idParsers';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  patch: {
    validators: { body: z.object({ label: z.string().optional(), done: z.boolean().optional() }) },
    handler: async ({ body, params }) => {
      const task = await taskUseCase.update({
        ...body,
        taskId: taskIdParser.parse(params.taskId),
      });

      return { status: 204, body: task };
    },
  },
  delete: async ({ params }) => {
    const task = await taskUseCase.delete(taskIdParser.parse(params.taskId));

    return { status: 204, body: task };
  },
}));
