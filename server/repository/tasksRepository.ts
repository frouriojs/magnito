import type { Maybe, TaskId, UserId } from '$/commonTypesWithClient/ids';
import type { Prisma, Task } from '@prisma/client';
import type { TaskModel } from 'commonTypesWithClient/models';
import { randomUUID } from 'crypto';
import { depend } from 'velona';
import { taskIdParser } from '../service/idParsers';
import { prismaClient } from '../service/prismaClient';

const toModel = (prismaTask: Task): TaskModel => ({
  id: taskIdParser.parse(prismaTask.id),
  label: prismaTask.label,
  done: prismaTask.done,
  created: prismaTask.createdAt.getTime(),
});

export const getTasks = async (userId: UserId, limit?: number): Promise<TaskModel[]> => {
  const prismaTasks = await prismaClient.task.findMany({
    where: { userId },
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  return prismaTasks.map(toModel);
};

export const createTask = async (userId: UserId, label: TaskModel['label']): Promise<TaskModel> => {
  const prismaTask = await prismaClient.task.create({
    data: {
      id: randomUUID(),
      userId,
      done: false,
      label,
      createdAt: new Date(),
    },
  });

  return toModel(prismaTask);
};

export const updateTaskByStringId = async (params: {
  userId: UserId;
  taskId: string;
  partialTask: Prisma.TaskUpdateInput;
}): Promise<TaskModel> => {
  const prismaTask = await prismaClient.task.update({
    where: { id: params.taskId, userId: params.userId },
    data: params.partialTask,
  });

  return toModel(prismaTask);
};

export const deleteTaskByStringId = async (userId: UserId, taskId: string): Promise<TaskModel> => {
  const prismaTask = await prismaClient.task.delete({
    where: { id: taskId, userId },
  });

  return toModel(prismaTask);
};

export const updateTaskByBrandedId = async (params: {
  userId: UserId;
  taskId: Maybe<TaskId>;
  partialTask: Prisma.TaskUpdateInput;
}): Promise<TaskModel> => {
  const prismaTask = await prismaClient.task.update({
    where: { id: params.taskId, userId: params.userId },
    data: params.partialTask,
  });

  return toModel(prismaTask);
};

export const deleteTaskByBrandedId = async (
  userId: UserId,
  taskId: Maybe<TaskId>
): Promise<TaskModel> => {
  const prismaTask = await prismaClient.task.delete({
    where: { id: taskId, userId },
  });

  return toModel(prismaTask);
};

export const findManyTask = async (userId: UserId) => {
  return await prismaClient.task.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
};

export const getTasksWithDI = depend(
  { findManyTask },
  async ({ findManyTask }, userId: UserId): Promise<TaskModel[]> => {
    const prismaTasks = await findManyTask(userId);

    return prismaTasks.map(toModel);
  }
);
