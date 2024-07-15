import type { AttributeType } from '@aws-sdk/client-cognito-identity-provider';
import type { UserEntity } from 'common/types/user';

export const createAttributes = (user: UserEntity): AttributeType[] => {
  return [
    { Name: 'sub', Value: user.id },
    { Name: 'email', Value: user.email },
    { Name: 'email_verified', Value: user.verified ? 'true' : 'false' },
  ];
};
