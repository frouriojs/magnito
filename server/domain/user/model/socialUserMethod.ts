import assert from 'assert';
import type { EntityId } from 'common/types/brandedId';
import type { SocialUserCreateVal, SocialUserEntity } from 'common/types/user';
import { brandedId } from 'service/brandedId';
import { cognitoAssert } from 'service/cognitoAssert';
import { ulid } from 'ulid';
import { z } from 'zod';
import { createAttributes } from '../service/createAttributes';

export const socialUserMethod = {
  create: (userPoolId: EntityId['userPool'], val: SocialUserCreateVal): SocialUserEntity => {
    cognitoAssert(
      /^[a-z][a-z\d_-]/.test(val.name),
      "1 validation error detected: Value at 'username' failed to satisfy constraint: Member must satisfy regular expression pattern: [\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+",
    );
    cognitoAssert(z.string().email().parse(val.email), 'Invalid email address format.');
    assert(z.string().url().optional().safeParse(val.photoUrl).success, 'Invalid photoUrl format.');

    const now = Date.now();

    return {
      id: brandedId.socialUser.entity.parse(ulid()),
      kind: 'social',
      email: val.email,
      provider: val.provider,
      codeChallenge: val.codeChallenge,
      authorizationCode: ulid(),
      enabled: true,
      status: 'EXTERNAL_PROVIDER',
      name: val.name,
      refreshToken: ulid(),
      userPoolId,
      attributes: val.photoUrl
        ? createAttributes([{ Name: 'picture', Value: val.photoUrl }], [])
        : [],
      createdTime: now,
      updatedTime: now,
    };
  },
};
