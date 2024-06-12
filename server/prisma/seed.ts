import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID } from 'service/envValues';
import { prismaClient } from 'service/prismaClient';
import { genPrivatekey } from 'service/privateKey';

async function main(): Promise<void> {
  const pool = await prismaClient.userPool.findUnique({ where: { id: DEFAULT_USER_POOL_ID } });
  const poolClient = await prismaClient.userPoolClient.findUnique({
    where: { id: DEFAULT_USER_POOL_CLIENT_ID },
  });
  const now = new Date();

  if (!pool) {
    await prismaClient.userPool.create({
      data: { id: DEFAULT_USER_POOL_ID, privateKey: genPrivatekey(), createdAt: now },
    });
  }

  if (!poolClient) {
    await prismaClient.userPoolClient.create({
      data: { id: DEFAULT_USER_POOL_CLIENT_ID, userPoolId: DEFAULT_USER_POOL_ID, createdAt: now },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
