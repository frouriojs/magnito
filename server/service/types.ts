import type { EntityId } from 'api/@types/brandedId';

export type JwtUser = { sub: EntityId['user']; 'cognito:username': string; email: string };
