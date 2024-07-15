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
  deleteUser: (user: UserEntity, userPoolId: string): EntityId['deletableUser'] => {
    assert(user.userPoolId === userPoolId);

    return brandedId.deletableUser.entity.parse(user.id);
  },
  setUserPassword: (user: UserEntity, req: AdminSetUserPasswordTarget['reqBody']): UserEntity => {
    assert(req.UserPoolId);
    assert(req.Password);
    validatePass(req.Password);

    return {
      ...user,
      ...genCredentials({ poolId: user.userPoolId, username: user.name, password: req.Password }),
      status: req.Permanent ? 'CONFIRMED' : 'FORCE_CHANGE_PASSWORD',
      password: req.Password,
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
