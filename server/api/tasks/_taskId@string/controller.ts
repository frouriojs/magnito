import { deleteTask, updateTask } from '$/repository/tasksRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  patch: async ({ body, params }) => {
    await updateTask(params.taskId, body);
    return { status: 204 };
  },
  delete: async ({ params }) => {
    await deleteTask(params.taskId);
    return { status: 204 };
  },
}));
