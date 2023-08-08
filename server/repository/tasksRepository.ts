import type { TaskModel } from '$/commonTypesWithClient/models';
import type { Prisma, Task } from '@prisma/client';
import { randomUUID } from 'crypto';
import { taskIdParser } from '../service/idParsers';
import { prismaClient } from '../service/prismaClient';

const toModel = (prismaTask: Task): TaskModel => ({
  id: taskIdParser.parse(prismaTask.id),
  label: prismaTask.label,
  done: prismaTask.done,
  created: prismaTask.createdAt.getTime(),
});

export const getTasks = async (limit?: number): Promise<TaskModel[]> => {
  const prismaTasks = await prismaClient.task.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return prismaTasks.map(toModel);
};

export const createTask = async (label: TaskModel['label']): Promise<TaskModel> => {
  const prismaTask = await prismaClient.task.create({
    data: { id: randomUUID(), done: false, label, createdAt: new Date() },
  });

  return toModel(prismaTask);
};

export const updateTask = async (
  id: string,
  partialTask: Prisma.TaskUpdateInput
): Promise<TaskModel> => {
  const prismaTask = await prismaClient.task.update({ where: { id }, data: partialTask });

  return toModel(prismaTask);
};

export const deleteTask = async (id: string): Promise<TaskModel> => {
  const prismaTask = await prismaClient.task.delete({ where: { id } });

  return toModel(prismaTask);
};
