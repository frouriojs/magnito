import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import type { Prisma } from '@prisma/client';
import assert from 'assert';
import { prismaClient, transaction } from 'service/prismaClient';

const migrateUser = async (tx: Prisma.TransactionClient): Promise<void> => {
  const users = await tx.user.findMany({ where: { updatedAt: null } });

  if (users.length > 0) {
    await tx.user.updateMany({
      data: users.map((user) => ({
        ...user,
        enabled: true,
        status: UserStatusType.CONFIRMED,
        updatedAt: user.createdAt,
      })),
    });
  }

  const test = async (): Promise<void> => {
    const users = await tx.user.findMany();

    users.forEach((user) => {
      assert(user.enabled !== null);
      assert(user.status !== null);
      assert(user.updatedAt !== null);
    });
  };

  await test();
};

transaction((tx) => Promise.all([migrateUser(tx)]))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
