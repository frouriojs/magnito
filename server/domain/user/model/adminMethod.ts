import assert from 'assert';
import type { AdminSetUserPasswordTarget } from 'common/types/auth';
import type { EntityId } from 'common/types/brandedId';
import type { UserEntity } from 'common/types/user';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import { genCredentials } from '../service/genCredentials';
import { validatePass } from '../service/validatePass';
import type { CreateUserVal } from './types';
import { userMethod } from './userMethod';

export const adminMethod = {
  createVerifiedUser: (idCount: number, val: CreateUserVal): UserEntity => ({
    ...userMethod.createUser(idCount, val),
    status: 'FORCE_CHANGE_PASSWORD',
    verified: true,
  }),
  deleteUser: (params: { user: UserEntity; userPoolId: string }): EntityId['deletableUser'] => {
    assert(params.user.userPoolId === params.userPoolId);

    return brandedId.deletableUser.entity.parse(params.user.id);
  },
  setUserPassword: (params: {
    user: UserEntity;
    req: AdminSetUserPasswordTarget['reqBody'];
  }): UserEntity => {
    assert(params.req.UserPoolId);
    assert(params.req.Password);
    validatePass(params.req.Password);

    return {
      ...params.user,
      ...genCredentials({
        poolId: params.user.userPoolId,
        username: params.user.name,
        password: params.req.Password,
      }),
      status: 'CONFIRMED',
      password: params.req.Password,
      refreshToken: ulid(),
      challenge: undefined,
      updatedTime: Date.now(),
    };
  },
};
