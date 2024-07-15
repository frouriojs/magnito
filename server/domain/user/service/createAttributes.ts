import type { AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import type { UserEntity } from 'common/types/user';

export const COMPUTED_ATTRIBUTE_NAMES = ['sub', 'email', 'email_verified', 'updated_at'] as const;

export const STANDARD_ATTRIBUTE_NAMES = [
  'address',
  'birthdate',
  'family_name',
  'gender',
  'given_name',
  'locale',
  'middle_name',
  'name',
  'nickname',
  'phone_number',
  'picture',
  'preferred_username',
  'profile',
  'website',
  'zoneinfo',
] as const;

export const createAttributes = (user: UserEntity): AttributeType[] => {
  return [
    { Name: 'sub', Value: user.id },
    { Name: 'email', Value: user.email },
    { Name: 'email_verified', Value: user.verified ? 'true' : 'false' },
  ];
};
