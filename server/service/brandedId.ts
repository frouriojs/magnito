import { BRANDED_ID_NAMES } from 'api/@constants';
import type { EntityId, IdName, MaybeId } from 'api/@types/brandedId';
import { z } from 'zod';

export const brandedId = BRANDED_ID_NAMES.reduce(
  (dict, current) => ({ ...dict, [current]: { entity: z.string(), maybe: z.string() } }),
  {} as {
    [Name in IdName]: { entity: z.ZodType<EntityId[Name]>; maybe: z.ZodType<MaybeId[Name]> };
  },
);
