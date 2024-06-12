import type { UserPool, UserPoolClient } from '@prisma/client';
import type { UserPoolClientEntity, UserPoolEntity } from 'api/@types/userPool';
import { brandedId } from 'service/brandedId';

export const toUserPoolEntity = (prismaPool: UserPool): UserPoolEntity => {
  return {
    id: brandedId.userPool.entity.parse(prismaPool.id),
    privateKey: prismaPool.privateKey,
    createdTime: prismaPool.createdAt.getTime(),
  };
};

export const toUserPoolClientEntity = (prismaPoolClient: UserPoolClient): UserPoolClientEntity => {
  return {
    id: brandedId.userPoolClient.entity.parse(prismaPoolClient.id),
    userPoolId: brandedId.userPool.entity.parse(prismaPoolClient.userPoolId),
    createdTime: prismaPoolClient.createdAt.getTime(),
  };
};
