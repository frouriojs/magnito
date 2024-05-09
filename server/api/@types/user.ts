import type { UserId } from './brandedId';

export type UserEntity = {
  id: UserId;
  email: string;
  displayName: string | undefined;
  photoURL: string | undefined;
  createdTime: number;
};
