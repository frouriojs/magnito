import type { Maybe, TaskId } from 'api/@types/brandedId';
import type { TaskCreateVal, TaskEntity, TaskUpdateVal } from 'api/@types/task';
import type { UserEntity } from 'api/@types/user';
import { transaction } from 'service/prismaClient';
import { taskMethod } from '../model/taskMethod';
import { taskCommand } from '../repository/taskCommand';
import { taskQuery } from '../repository/taskQuery';

export const taskUseCase = {
  create: (user: UserEntity, val: TaskCreateVal): Promise<TaskEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const task = await taskMethod.create(user, val);

      await taskCommand.save(tx, task);

      return task;
    }),
  update: (user: UserEntity, val: TaskUpdateVal): Promise<TaskEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const task = await taskQuery.findById(tx, val.taskId);
      const updated = await taskMethod.update(user, task, val);

      await taskCommand.save(tx, updated);

      return updated;
    }),
  delete: (user: UserEntity, taskId: Maybe<TaskId>): Promise<TaskEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const task = await taskQuery.findById(tx, taskId);
      const deleteVal = taskMethod.delete(user, task);

      await taskCommand.delete(tx, deleteVal);

      return task;
    }),
};
