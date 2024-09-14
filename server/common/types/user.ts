import type { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import type { PROVIDER_LIST, USER_KINDS } from 'common/constants';
import type { EntityId, MaybeId } from './brandedId';

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
  enabled: boolean;
  status: typeof UserStatusType.EXTERNAL_PROVIDER;
  email: string;
  provider: (typeof PROVIDER_LIST)[number];
  password?: undefined;
  confirmationCode?: undefined;
  authorizationCode: string;
  codeChallenge: string;
  salt?: undefined;
  verifier?: undefined;
  refreshToken: string;
  userPoolId: EntityId['userPool'];
  attributes: UserAttributeEntity[];
  createdTime: number;
  updatedTime: number;
  challenge?: undefined;
};

export type CognitoUserEntity = {
  id: EntityId['cognitoUser'];
  kind: typeof USER_KINDS.cognito;
  name: string;
  enabled: boolean;
  status: UserStatusType;
  email: string;
  provider?: undefined;
  password: string;
  confirmationCode: string;
  authorizationCode?: undefined;
  codeChallenge?: undefined;
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

export type SocialUserCreateVal = {
  provider: (typeof PROVIDER_LIST)[number];
  name: string;
  email: string;
  codeChallenge: string;
  photoUrl?: string;
  userPoolClientId: MaybeId['userPoolClient'];
};
