import { createTask, getTasks } from '$/repository/tasksRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => ({ status: 200, body: await getTasks(query?.limit) }),
  post: async ({ body }) => ({ status: 201, body: await createTask(body.label) }),
}));
