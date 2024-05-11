import type { Prisma, Task } from '@prisma/client';
import type { Maybe, TaskId } from 'api/@types/brandedId';
import type { TaskEntity } from 'api/@types/task';
import { taskIdParser } from 'service/idParsers';

const toModel = async (prismaTask: Task): Promise<TaskEntity> => ({
  id: taskIdParser.parse(prismaTask.id),
  label: prismaTask.label,
  done: prismaTask.done,
  createdTime: prismaTask.createdAt.getTime(),
});

const findMany = async (tx: Prisma.TransactionClient, limit?: number): Promise<TaskEntity[]> => {
  const prismaTasks = await tx.task.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return Promise.all(prismaTasks.map(toModel));
};

export const taskQuery = {
  findMany,
  findById: async (tx: Prisma.TransactionClient, taskId: Maybe<TaskId>): Promise<TaskEntity> =>
    tx.task.findUniqueOrThrow({ where: { id: taskId } }).then(toModel),
};
