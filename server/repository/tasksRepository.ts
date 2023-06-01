import type { TaskModel } from '$/commonTypesWithClient/models';
import type { Prisma, Task } from '$prisma/client';
import { randomUUID } from 'crypto';
import { taskIdParser } from '../service/idParsers';
import { prismaClient } from '../service/prismaClient';

const toModel = (prismaTask: Task): TaskModel => ({
  id: taskIdParser.parse(prismaTask.id),
  label: prismaTask.label,
  done: prismaTask.done,
  created: prismaTask.createdAt.getTime(),
});

export const getTasks = async (limit?: number): Promise<TaskModel[]> =>
  (await prismaClient.task.findMany({ take: limit, orderBy: { createdAt: 'desc' } })).map(toModel);

export const createTask = (label: TaskModel['label']): Promise<TaskModel> =>
  prismaClient.task
    .create({ data: { id: randomUUID(), done: false, label, createdAt: new Date() } })
    .then(toModel);

export const updateTask = (id: string, partialTask: Prisma.TaskUpdateInput): Promise<TaskModel> =>
  prismaClient.task.update({ where: { id }, data: partialTask }).then(toModel);

export const deleteTask = (id: string): Promise<TaskModel> =>
  prismaClient.task.delete({ where: { id } }).then(toModel);
