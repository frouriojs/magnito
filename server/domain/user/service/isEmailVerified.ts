import type { UserEntity } from 'common/types/user';

export const isEmailVerified = (user: UserEntity): boolean =>
  user.status === 'CONFIRMED' || user.status === 'FORCE_CHANGE_PASSWORD';
