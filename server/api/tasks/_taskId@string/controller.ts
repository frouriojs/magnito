import { taskUseCase } from 'domain/task/useCase/taskUseCase';
import { brandedId } from 'service/brandedId';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  patch: {
    validators: { body: z.object({ label: z.string().optional(), done: z.boolean().optional() }) },
    handler: async ({ body, params }) => {
      const task = await taskUseCase.update({
        ...body,
        taskId: brandedId.task.maybe.parse(params.taskId),
      });

      return { status: 204, body: task };
    },
  },
  delete: async ({ params }) => {
    const task = await taskUseCase.delete(brandedId.task.maybe.parse(params.taskId));

    return { status: 204, body: task };
  },
}));
