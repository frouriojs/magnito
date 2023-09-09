import {
  createTask,
  deleteTaskByBrandedId,
  getTasks,
  updateTaskByBrandedId,
} from '$/repository/tasksRepository';
import { taskIdParser } from '$/service/idParsers';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ user, query }) => ({
    status: 200,
    body: await getTasks(user.id, query?.limit),
  }),
  post: {
    validators: { body: z.object({ label: z.string() }) },
    handler: async ({ user, body }) => ({
      status: 201,
      body: await createTask(user.id, body.label),
    }),
  },
  patch: {
    validators: {
      body: z.object({
        taskId: taskIdParser,
        label: z.string().optional(),
        done: z.boolean().optional(),
      }),
    },
    handler: async ({ user, body }) => {
      const task = await updateTaskByBrandedId({
        userId: user.id,
        taskId: body.taskId,
        partialTask: body,
      });

      return { status: 204, body: task };
    },
  },
  delete: async ({ user, body }) => {
    const task = await deleteTaskByBrandedId(user.id, body.taskId);
    return { status: 204, body: task };
  },
}));
