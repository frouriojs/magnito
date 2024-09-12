import type { Prisma } from '@prisma/client';
import assert from 'assert';
import { USER_KINDS } from 'common/constants';
import { prismaClient, transaction } from 'service/prismaClient';

const migrateUser = async (tx: Prisma.TransactionClient): Promise<void> => {
  const users = await tx.user.findMany({ where: { kind: null } });

  if (users.length > 0) {
    await tx.user.updateMany({
      data: users.map((user) => ({ ...user, kind: USER_KINDS.cognito })),
    });
  }

  const test = async (): Promise<void> => {
    const users = await tx.user.findMany();

    users.forEach((user) => {
      assert(user.kind !== null);
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
