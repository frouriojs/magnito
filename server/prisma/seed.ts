import { prismaClient } from 'service/prismaClient';

async function main(): Promise<void> {}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
