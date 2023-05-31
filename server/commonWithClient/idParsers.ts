import { z } from 'zod';
import type { VerifiedUserId } from './branded';

export const verifiedUserIdParser: z.ZodType<VerifiedUserId> = z.string().brand<'VerifiedUserId'>();
