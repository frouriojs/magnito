import { deleteTaskByStringId, updateTaskByStringId } from '$/repository/tasksRepository';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  patch: {
    validators: {
      body: z.object({
        label: z.string().optional(),
        done: z.boolean().optional(),
      }),
    },
    handler: async ({ user, body, params }) => {
      const task = await updateTaskByStringId({
        userId: user.id,
        taskId: params.taskId,
        partialTask: body,
      });

      return { status: 204, body: task };
    },
  },
  delete: async ({ user, params }) => {
    const task = await deleteTaskByStringId(user.id, params.taskId);
    return { status: 204, body: task };
  },
}));
