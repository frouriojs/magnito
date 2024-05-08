import { Prisma, PrismaClient } from '@prisma/client';

export const prismaClient = new PrismaClient();

export const transaction = <U>(
  isolationLevel: Prisma.TransactionIsolationLevel,
  fn: (tx: Prisma.TransactionClient) => Promise<U>,
  retry = 3,
): Promise<U> =>
  prismaClient.$transaction<U>(fn, { isolationLevel }).catch((e) => {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      ['P2028', 'P2034'].includes(e.code) &&
      retry > 0
    ) {
      return transaction(isolationLevel, fn, retry - 1);
    }

    throw e;
  });
