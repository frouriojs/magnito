import type { Prisma, Task } from '@prisma/client';
import type { MaybeId } from 'api/@types/brandedId';
import type { TaskEntity } from 'api/@types/task';
import { brandedId } from 'service/brandedId';

const toEntity = async (prismaTask: Task): Promise<TaskEntity> => ({
  id: brandedId.task.entity.parse(prismaTask.id),
  label: prismaTask.label,
  done: prismaTask.done,
  createdTime: prismaTask.createdAt.getTime(),
});

export const taskQuery = {
  findMany: async (tx: Prisma.TransactionClient, limit?: number): Promise<TaskEntity[]> => {
    const prismaTasks = await tx.task.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(prismaTasks.map(toEntity));
  },
  findById: async (tx: Prisma.TransactionClient, taskId: MaybeId['task']): Promise<TaskEntity> =>
    tx.task.findUniqueOrThrow({ where: { id: taskId } }).then(toEntity),
};
