import type { BRANDED_ID_NAMES } from 'api/@constants';
import type { z } from 'zod';

export type IdName = (typeof BRANDED_ID_NAMES)[number];

type Branded<T extends string> = string & z.BRAND<T>;
type Entity<T extends IdName> = string & z.BRAND<`${T}EntityId`>;

export type EntityId = { [T in IdName]: Entity<T> };
export type MaybeId = { [T in IdName]: Entity<T> | Branded<'maybe'> };
