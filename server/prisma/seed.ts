import assert from 'assert';
import { USER_STATUSES } from 'common/constants';
import { prismaClient } from 'service/prismaClient';

async function main(): Promise<void> {
  const users = await prismaClient.user.findMany({ where: { enabled: null } });

  users.length > 0 &&
    (await prismaClient.user.updateMany({
      data: users.map((user) => ({
        ...user,
        enabled: true,
        status: USER_STATUSES[user.verified ? 1 : 0],
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
