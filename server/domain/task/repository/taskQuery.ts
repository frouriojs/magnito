import type { Prisma, Task, User } from '@prisma/client';
import type { Maybe, TaskId, UserId } from 'api/@types/brandedId';
import type { TaskEntity } from 'api/@types/task';
import { taskIdParser, userIdParser } from 'service/idParsers';
import { s3 } from 'service/s3Client';
import { depend } from 'velona';

const toModel = async (prismaTask: Task & { Author: User }): Promise<TaskEntity> => ({
  id: taskIdParser.parse(prismaTask.id),
  label: prismaTask.label,
  done: prismaTask.done,
  image:
    prismaTask.imageKey === null
      ? undefined
      : { url: await s3.getSignedUrl(prismaTask.imageKey), s3Key: prismaTask.imageKey },
  author: {
    id: userIdParser.parse(prismaTask.authorId),
    displayName: prismaTask.Author.displayName ?? undefined,
  },
  createdTime: prismaTask.createdAt.getTime(),
});

const findManyByAuthorId = async (
  tx: Prisma.TransactionClient,
  authorId: UserId,
  limit?: number,
): Promise<TaskEntity[]> => {
  const prismaTasks = await tx.task.findMany({
    where: { authorId },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { Author: true },
  });

  return Promise.all(prismaTasks.map(toModel));
};

export const taskQuery = {
  findManyByAuthorId,
  findManyWithDI: depend(
    { findManyByAuthorId },
    (deps, tx: Prisma.TransactionClient, userId: UserId): Promise<TaskEntity[]> =>
      deps.findManyByAuthorId(tx, userId),
  ),
  findById: async (tx: Prisma.TransactionClient, taskId: Maybe<TaskId>): Promise<TaskEntity> =>
    tx.task.findUniqueOrThrow({ where: { id: taskId }, include: { Author: true } }).then(toModel),
};
