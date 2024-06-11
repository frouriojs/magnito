import type { EntityId } from './brandedId';

export type UserEntity = {
  id: EntityId['user'];
  name: string;
  email: string;
  createdTime: number;
};
