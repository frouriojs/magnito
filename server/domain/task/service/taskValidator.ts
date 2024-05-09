import type { TaskCreateVal, TaskUpdateVal } from 'api/@types/task';
import { taskIdParser } from 'service/idParsers';
import { z } from 'zod';

export const taskValidator = {
  taskCreate: z.object({ label: z.string() }) satisfies z.ZodType<TaskCreateVal>,
  taskUpdate: z.object({
    taskId: taskIdParser,
    label: z.string().optional(),
    done: z.boolean().optional(),
  }) satisfies z.ZodType<TaskUpdateVal>,
};
