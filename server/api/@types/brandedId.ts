import type { z } from 'zod';

type Branded<T extends string> = string & z.BRAND<T>;

export type Maybe<T> = T | Branded<'Maybe'>;

export type TaskId = Branded<'TaskId'>;
export type DeletableTaskId = Branded<'DeletableTaskId'>;
