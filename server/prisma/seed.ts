import type { Prisma } from '@prisma/client';
import assert from 'assert';
import { USER_KINDS } from 'common/constants';
import { createHash } from 'crypto';
import { prismaClient, transaction } from 'service/prismaClient';
import { ulid } from 'ulid';

const migrateUser = async (tx: Prisma.TransactionClient): Promise<void> => {
  const users = await tx.user.findMany({ where: { kind: null } });

  if (users.length > 0) {
    await Promise.all(
      users.map(({ id, ...user }) =>
        tx.user.update({ where: { id }, data: { ...user, kind: USER_KINDS.cognito } }),
      ),
    );
  }

  const socials = await tx.user.findMany({
    where: { kind: USER_KINDS.social, authorizationCode: null },
  });

  if (socials.length > 0) {
    await Promise.all(
      socials.map(({ id, ...s }) =>
        tx.user.update({
          where: { id },
          data: {
            ...s,
            authorizationCode: ulid(),
            codeChallenge: createHash('sha256').update(ulid()).digest('base64url'),
          },
        }),
      ),
    );
  }

  const test = async (): Promise<void> => {
    const users = await tx.user.findMany();

    users.forEach((user) => {
      assert(user.kind !== null);
      assert(
        user.kind === USER_KINDS.cognito ||
          (user.authorizationCode !== null && user.codeChallenge !== null),
      );
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
