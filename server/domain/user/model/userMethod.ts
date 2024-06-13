import type { UserEntity } from 'api/@types/user';
import assert from 'assert';
import { brandedId } from 'service/brandedId';
import { DEFAULT_USER_POOL_ID } from 'service/envValues';
import { ulid } from 'ulid';
import { genConfirmationCode } from '../service/genConfirmationCode';

export const userMethod = {
  createUser: (val: {
    name: string;
    email: string;
    salt: string;
    verifier: string;
  }): UserEntity => ({
    id: brandedId.user.entity.parse(val.name),
    email: val.email,
    name: val.name,
    refreshToken: ulid(),
    userPoolId: DEFAULT_USER_POOL_ID,
    verified: false,
    confirmationCode: genConfirmationCode(),
    salt: val.salt,
    verifier: val.verifier,
    createdTime: Date.now(),
  }),
  verifyUser: (user: UserEntity, confirmationCode: string): UserEntity => {
    assert(user.confirmationCode === confirmationCode);

    return { ...user, verified: true };
  },
};
