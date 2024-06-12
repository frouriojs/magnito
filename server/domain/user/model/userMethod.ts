import type { UserEntity } from 'api/@types/user';
import { brandedId } from 'service/brandedId';

export const userMethod = {
  createUser: (val: { name: string; email: string }): UserEntity => ({
    id: brandedId.user.entity.parse(val.name),
    email: val.email,
    name: val.name,
    createdTime: Date.now(),
  }),
};
