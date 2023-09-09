import { findManyTask, getTasksWithDI } from '$/repository/tasksRepository';
import { defineController } from './$relay';

export default defineController({ findManyTask }, (deps) => ({
  get: async ({ user }) => ({
    status: 200,
    body: await getTasksWithDI.inject(deps)(user.id),
  }),
}));
