import type { UserPoolClientEntity, UserPoolEntity } from 'common/types/userPool';
import { prismaClient } from 'service/prismaClient';

export const userPoolCommand = {
  save: async (pool: UserPoolEntity): Promise<void> => {
    await prismaClient.userPool.upsert({
      where: { id: pool.id },
      update: { privateKey: pool.privateKey },
      create: { id: pool.id, privateKey: pool.privateKey, createdAt: new Date(pool.createdTime) },
    });
  },
  saveClient: async (poolClient: UserPoolClientEntity): Promise<void> => {
    await prismaClient.userPoolClient.upsert({
      where: { id: poolClient.id },
      update: {},
      create: {
        id: poolClient.id,
        userPoolId: poolClient.userPoolId,
        createdAt: new Date(poolClient.createdTime),
      },
    });
  },
};
