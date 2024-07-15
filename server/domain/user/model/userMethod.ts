import type { AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import assert from 'assert';
import type { ChangePasswordTarget, Jwks, UserSrpAuthTarget } from 'common/types/auth';
import type { EntityId } from 'common/types/brandedId';
import type { ChallengeVal, UserAttributeEntity, UserEntity } from 'common/types/user';
import type { UserPoolClientEntity, UserPoolEntity } from 'common/types/userPool';
import crypto from 'crypto';
import { genConfirmationCode } from 'domain/user/service/genConfirmationCode';
import { genTokens } from 'domain/user/service/genTokens';
import {
  calculateScramblingParameter,
  calculateSessionKey,
} from 'domain/user/service/srp/calcSessionKey';
import { calculateSignature } from 'domain/user/service/srp/calcSignature';
import { calculateSrpB } from 'domain/user/service/srp/calcSrpB';
import { getPoolName } from 'domain/user/service/srp/util';
import { brandedId } from 'service/brandedId';
import { cognitoAssert } from 'service/cognitoAssert';
import { ulid } from 'ulid';
import { z } from 'zod';
import { genCredentials } from '../service/genCredentials';
import { validatePass } from '../service/validatePass';

const createAttribute = (attr: AttributeType): UserAttributeEntity => ({
  id: brandedId.userAttribute.entity.parse(ulid()),
  name: z.string().parse(attr.Name),
  value: z.string().parse(attr.Value),
});

export const userMethod = {
  create: (
    idCount: number,
    params: {
      name: string;
      password: string;
      email: string;
      userPoolId: EntityId['userPool'];
      attributes: AttributeType[] | undefined;
    },
  ): UserEntity => {
    assert(params.attributes);
    cognitoAssert(idCount === 0, 'User already exists');
    cognitoAssert(
      /^[a-z][a-z\d_-]/.test(params.name),
      "1 validation error detected: Value at 'username' failed to satisfy constraint: Member must satisfy regular expression pattern: [\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+",
    );
    validatePass(params.password);
    cognitoAssert(z.string().email().parse(params.email), 'Invalid email address format.');

    const now = Date.now();

    return {
      ...genCredentials({
        poolId: params.userPoolId,
        username: params.name,
        password: params.password,
      }),
      id: brandedId.user.entity.parse(ulid()),
      email: params.email,
      enabled: true,
      status: 'UNCONFIRMED',
      name: params.name,
      password: params.password,
      refreshToken: ulid(),
      userPoolId: params.userPoolId,
      verified: false,
      confirmationCode: genConfirmationCode(),
      attributes: params.attributes.filter((attr) => attr.Name !== 'email').map(createAttribute),
      createdTime: now,
      updatedTime: now,
    };
  },
  confirm: (user: UserEntity, confirmationCode: string): UserEntity => {
    cognitoAssert(
      user.confirmationCode === confirmationCode,
      'Invalid verification code provided, please try again.',
    );

    return { ...user, status: 'CONFIRMED', verified: true, updatedTime: Date.now() };
  },
  createChallenge: (
    user: UserEntity,
    params: UserSrpAuthTarget['reqBody']['AuthParameters'],
  ): {
    userWithChallenge: UserEntity;
    ChallengeParameters: UserSrpAuthTarget['resBody']['ChallengeParameters'];
  } => {
    const { B, b } = calculateSrpB(user.verifier);
    const secretBlock = crypto.randomBytes(64).toString('base64');
    const challenge: ChallengeVal = { pubB: B, secB: b, pubA: params.SRP_A, secretBlock };

    return {
      userWithChallenge: { ...user, challenge },
      ChallengeParameters: {
        SALT: user.salt,
        SECRET_BLOCK: secretBlock,
        SRP_B: B,
        USERNAME: user.name,
        USER_ID_FOR_SRP: user.name,
      },
    };
  },
  srpAuth: (params: {
    user: UserEntity;
    timestamp: string;
    clientSignature: string;
    jwks: Jwks;
    pool: UserPoolEntity;
    poolClient: UserPoolClientEntity;
  }): { AccessToken: string; IdToken: string } => {
    assert(params.user.challenge);
    const { pubA: A, pubB: B, secB: b } = params.user.challenge;
    const poolname = getPoolName(params.user.userPoolId);
    const scramblingParameter = calculateScramblingParameter(A, B);
    const sessionKey = calculateSessionKey({ A, B, b, v: params.user.verifier });
    const signature = calculateSignature({
      poolname,
      username: params.user.name,
      secretBlock: params.user.challenge.secretBlock,
      timestamp: params.timestamp,
      scramblingParameter,
      key: sessionKey,
    });
    cognitoAssert(signature === params.clientSignature, 'Incorrect username or password.');

    return genTokens({
      privateKey: params.pool.privateKey,
      userPoolClientId: params.poolClient.id,
      jwks: params.jwks,
      user: params.user,
    });
  },
  changePassword: (params: {
    user: UserEntity;
    req: ChangePasswordTarget['reqBody'];
  }): UserEntity => {
    cognitoAssert(
      params.user.password === params.req.PreviousPassword,
      'Incorrect username or password.',
    );
    validatePass(params.req.ProposedPassword);

    return {
      ...params.user,
      ...genCredentials({
        poolId: params.user.userPoolId,
        username: params.user.name,
        password: params.req.ProposedPassword,
      }),
      password: params.req.ProposedPassword,
      refreshToken: ulid(),
      challenge: undefined,
      updatedTime: Date.now(),
    };
  },
  forgotPassword: (user: UserEntity): UserEntity => {
    const confirmationCode = genConfirmationCode();

    return { ...user, status: 'RESET_REQUIRED', confirmationCode, updatedTime: Date.now() };
  },
  confirmForgotPassword: (params: {
    user: UserEntity;
    confirmationCode: string;
    password: string;
  }): UserEntity => {
    const { user, confirmationCode } = params;
    cognitoAssert(
      user.confirmationCode === confirmationCode,
      'Invalid verification code provided, please try again.',
    );
    validatePass(params.password);

    return {
      ...user,
      ...genCredentials({
        poolId: user.userPoolId,
        username: user.name,
        password: params.password,
      }),
      status: 'CONFIRMED',
      confirmationCode: '',
      updatedTime: Date.now(),
    };
  },
};
