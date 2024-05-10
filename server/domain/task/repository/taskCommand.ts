import type { Prisma } from '@prisma/client';
import { s3 } from 'service/s3Client';
import type { TaskDeleteVal, TaskSaveVal } from '../model/taskEntity';

export const taskCommand = {
  save: async (tx: Prisma.TransactionClient, val: TaskSaveVal): Promise<void> => {
    if (val.s3Params !== undefined) await s3.put(val.s3Params);

    await tx.task.upsert({
      where: { id: val.task.id },
      update: { label: val.task.label, done: val.task.done, imageKey: val.task.image?.s3Key },
      create: {
        id: val.task.id,
        label: val.task.label,
        done: val.task.done,
        imageKey: val.task.image?.s3Key,
        createdAt: new Date(val.task.createdTime),
        authorId: val.task.author.id,
      },
    });
  },
  delete: async (tx: Prisma.TransactionClient, val: TaskDeleteVal): Promise<void> => {
    await tx.task.delete({ where: { id: val.deletableId } });

    if (val.task.image !== undefined) await s3.delete(val.task.image.s3Key);
  },
};
