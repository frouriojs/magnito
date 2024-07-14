import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import assert from 'assert';
import { prismaClient } from 'service/prismaClient';

async function main(): Promise<void> {
  const users = await prismaClient.user.findMany({ where: { enabled: null } });

  users.length > 0 &&
    (await prismaClient.user.updateMany({
      data: users.map((user) => ({
        ...user,
        enabled: true,
        status: user.verified ? UserStatusType.CONFIRMED : UserStatusType.UNCONFIRMED,
        updatedAt: user.createdAt,
      })),
    }));

  const test = async (): Promise<void> => {
    const users = await prismaClient.user.findMany();

    users.forEach((user) => {
      assert(user.enabled !== null);
      assert(user.status !== null);
      assert(user.updatedAt !== null);
    });
  };

  await test();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
