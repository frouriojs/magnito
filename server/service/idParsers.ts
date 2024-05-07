import type { TaskId, UserId } from 'api/@types/brandedId';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createIdParser = <T extends string>(): z.ZodType<T> => z.string() as any;

export const userIdParser = createIdParser<UserId>();

export const taskIdParser = createIdParser<TaskId>();
