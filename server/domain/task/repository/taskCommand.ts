import type { Prisma } from '@prisma/client';
import assert from 'assert';
import type { TaskEntity } from 'common/types/task';
import type { TaskDeleteVal } from '../model/taskEntity';

export const taskCommand = {
  save: async (tx: Prisma.TransactionClient, task: TaskEntity): Promise<void> => {
    await tx.task.upsert({
      where: { id: task.id },
      update: { label: task.label, done: task.done },
      create: {
        id: task.id,
        label: task.label,
        done: task.done,
        createdAt: new Date(task.createdTime),
      },
    });
  },
  delete: async (tx: Prisma.TransactionClient, val: TaskDeleteVal): Promise<void> => {
    assert(val.deletable);

    await tx.task.delete({ where: { id: val.task.id } });
  },
};
