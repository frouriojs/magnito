import type { Maybe } from 'api/@types/brandedId';
import type { TaskCreateVal, TaskUpdateVal } from 'api/@types/task';
import { taskIdParser } from 'service/idParsers';
import { z } from 'zod';

export const taskParser = {
  toTaskCreate: (data: unknown): TaskCreateVal => z.object({ label: z.string() }).parse(data),
  toTaskUpdate: (data: Maybe<TaskUpdateVal>): TaskUpdateVal =>
    z
      .object({ taskId: taskIdParser, label: z.string().optional(), done: z.boolean().optional() })
      .parse(data),
};
