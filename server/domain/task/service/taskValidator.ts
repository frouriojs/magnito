import type { TaskCreateVal, TaskUpdateVal } from 'common/types/task';
import { brandedId } from 'service/brandedId';
import { z } from 'zod';

export const taskValidator = {
  taskCreate: z.object({ label: z.string() }) satisfies z.ZodType<TaskCreateVal>,
  taskUpdate: z.object({
    taskId: brandedId.task.maybe,
    label: z.string().optional(),
    done: z.boolean().optional(),
  }) satisfies z.ZodType<TaskUpdateVal>,
};
