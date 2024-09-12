import type { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import type { USER_KINDS } from 'common/constants';
import type { EntityId } from './brandedId';

export type ChallengeVal = {
  secretBlock: string;
  pubA: string;
  pubB: string;
  secB: string;
};

export type UserAttributeEntity = {
  id: EntityId['userAttribute'];
  name: string;
  value: string;
};

export type SocialUserEntity = {
  id: EntityId['socialUser'];
  kind: typeof USER_KINDS.social;
  name: string;
  email: string;
  refreshToken: string;
  userPoolId: EntityId['userPool'];
  attributes: UserAttributeEntity[];
  createdTime: number;
  updatedTime: number;
};

export type CognitoUserEntity = {
  id: EntityId['cognitoUser'];
  kind: typeof USER_KINDS.cognito;
  name: string;
  enabled: boolean;
  status: UserStatusType;
  email: string;
  password: string;
  confirmationCode: string;
  salt: string;
  verifier: string;
  refreshToken: string;
  userPoolId: EntityId['userPool'];
  attributes: UserAttributeEntity[];
  createdTime: number;
  updatedTime: number;
  challenge?: ChallengeVal;
};

export type UserEntity = SocialUserEntity | CognitoUserEntity;
