import type { AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import assert from 'assert';
import type { AdminCreateUserTarget, AdminSetUserPasswordTarget } from 'common/types/auth';
import type { EntityId } from 'common/types/brandedId';
import type { UserEntity } from 'common/types/user';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import { createAttributes } from '../service/createAttributes';
import { findEmail } from '../service/findEmail';
import { genCredentials } from '../service/genCredentials';
import { validatePass } from '../service/validatePass';
import { userMethod } from './userMethod';

export const adminMethod = {
  createVerifiedUser: (
    idCount: number,
    req: AdminCreateUserTarget['reqBody'],
    userPoolId: EntityId['userPool'],
  ): UserEntity => {
    assert(req.Username);

    const password = req.TemporaryPassword ?? `TempPass-${Date.now()}`;
    const email = findEmail(req.UserAttributes);

    return {
      ...userMethod.create(idCount, {
        name: req.Username,
        password,
        email,
        userPoolId,
        attributes: req.UserAttributes,
      }),
      status: 'FORCE_CHANGE_PASSWORD',
    };
  },
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
  updateAttributes: (user: UserEntity, attributes: AttributeType[] | undefined): UserEntity => {
    assert(attributes);
    const email = attributes.find((attr) => attr.Name === 'email')?.Value ?? user.email;

    return {
      ...user,
      attributes: createAttributes(attributes, user.attributes),
      email,
      updatedTime: Date.now(),
    };
  },
};
