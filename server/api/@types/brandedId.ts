import type { z } from 'zod';

type Branded<T extends string> = string & z.BRAND<T>;

export type Maybe<T> = T | Branded<'Maybe'>;

export type AdminUserId = Branded<'AdminUserId'>;
export type GeneralUserId = Branded<'GeneralUserId'>;
export type TaskId = Branded<'TaskId'>;
