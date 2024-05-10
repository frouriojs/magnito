import { multipartFileValidator } from 'api/$relay';
import type { TaskUpdateVal } from 'api/@types/task';
import { taskIdParser } from 'service/idParsers';
import { z } from 'zod';
import type { TaskCreateServerVal } from '../model/taskEntity';

export const taskValidator = {
  taskCreate: z.object({
    label: z.string(),
    image: multipartFileValidator().optional(),
  }) satisfies z.ZodType<TaskCreateServerVal>,
  taskUpdate: z.object({
    taskId: taskIdParser,
    label: z.string().optional(),
    done: z.boolean().optional(),
  }) satisfies z.ZodType<TaskUpdateVal>,
};
