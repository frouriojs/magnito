import { prismaClient } from '$/service/prismaClient';
import { randomUUID } from 'crypto';

async function main() {
  const count = await prismaClient.task.count();

  if (count > 0) return;

  await Promise.all(
    [
      {
        id: randomUUID(),
        userId: 'dummy-userId',
        label: 'task1',
        done: true,
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        userId: 'dummy-userId',
        label: 'task2',
        done: false,
        createdAt: new Date(Date.now() + 100),
      },
    ].map((data) => prismaClient.task.create({ data }))
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
