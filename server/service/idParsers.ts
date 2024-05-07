import type { TaskId, UserId } from 'api/@types/ids';
import { z } from 'zod';

const createIdParser = <T extends string>() => z.string() as unknown as z.ZodType<T>;

export const userIdParser = createIdParser<UserId>();

export const taskIdParser = createIdParser<TaskId>();
