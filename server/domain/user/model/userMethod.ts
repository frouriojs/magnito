import type { ChangePasswordTarget, Jwks, UserSrpAuthTarget } from 'api/@types/auth';
import type { EntityId } from 'api/@types/brandedId';
import type { ChallengeVal, UserEntity } from 'api/@types/user';
import type { UserPoolClientEntity, UserPoolEntity } from 'api/@types/userPool';
import assert from 'assert';
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

type CreateUserVal = {
  name: string;
  password: string;
  email: string;
  userPoolId: EntityId['userPool'];
};

function validatePass(password: string): asserts password {
  cognitoAssert(
    password.length >= 8,
    'Password did not conform with policy: Password not long enough',
  );
  cognitoAssert(
    /[a-z]/.test(password),
    'Password did not conform with policy: Password must have lowercase characters',
  );
  cognitoAssert(
    /[A-Z]/.test(password),
    'Password did not conform with policy: Password must have uppercase characters',
  );
  cognitoAssert(
    /[0-9]/.test(password),
    'Password did not conform with policy: Password must have numeric characters',
  );
  cognitoAssert(
    /[!-/:-@[-`{-~]/.test(password),
    'Password did not conform with policy: Password must have symbol characters',
  );
}

export const userMethod = {
  createUser: (idCount: number, val: CreateUserVal): UserEntity => {
    cognitoAssert(idCount === 0, 'User already exists');
    cognitoAssert(
      /^[a-z][a-z\d_-]/.test(val.name),
      "1 validation error detected: Value at 'username' failed to satisfy constraint: Member must satisfy regular expression pattern: [\\p{L}\\p{M}\\p{S}\\p{N}\\p{P}]+",
    );
    validatePass(val.password);
    cognitoAssert(z.string().email().parse(val.email), 'Invalid email address format.');

    return {
      ...genCredentials({ poolId: val.userPoolId, username: val.name, password: val.password }),
      id: brandedId.user.entity.parse(val.name),
      email: val.email,
      name: val.name,
      password: val.password,
      refreshToken: ulid(),
      userPoolId: val.userPoolId,
      verified: false,
      confirmationCode: genConfirmationCode(),
      createdTime: Date.now(),
    };
  },
  createVerifiedUser: (idCount: number, val: CreateUserVal): UserEntity => ({
    ...userMethod.createUser(idCount, val),
    verified: true,
  }),
  verifyUser: (user: UserEntity, confirmationCode: string): UserEntity => {
    cognitoAssert(
      user.confirmationCode === confirmationCode,
      'Invalid verification code provided, please try again.',
    );

    return { ...user, verified: true };
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
  }): {
    AccessToken: string;
    IdToken: string;
  } => {
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
  delete: (params: { user: UserEntity; userPoolId: string }): EntityId['deletableUser'] => {
    assert(params.user.userPoolId === params.userPoolId);

    return brandedId.deletableUser.entity.parse(params.user.id);
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
    };
  },
};
