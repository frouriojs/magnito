import type { Maybe, TaskId } from 'api/@types/brandedId';
import type { UserModel } from 'api/@types/models';
import type { TaskCreateVal, TaskEntity, TaskUpdateVal } from 'api/@types/task';
import { transaction } from 'service/prismaClient';
import { taskMethod } from '../model/taskMethod';
import { taskParser } from '../model/taskParser';
import { taskCommand } from '../repository/taskCommand';
import { taskQuery } from '../repository/taskQuery';

export const taskUseCase = {
  create: (user: UserModel, data: Maybe<TaskCreateVal>): Promise<TaskEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const val = taskParser.toTaskCreate(data);
      const task = await taskMethod.create(user, val);

      await taskCommand.save(tx, task);

      return task;
    }),
  update: (user: UserModel, data: Maybe<TaskUpdateVal>): Promise<TaskEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const val = taskParser.toTaskUpdate(data);
      const task = await taskQuery.findById(tx, val.taskId);
      const updated = await taskMethod.update(user, task, val);

      await taskCommand.save(tx, updated);

      return updated;
    }),
  delete: (user: UserModel, taskId: Maybe<TaskId>): Promise<TaskEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const task = await taskQuery.findById(tx, taskId);
      const deleteVal = taskMethod.delete(user, task);

      await taskCommand.delete(tx, deleteVal);

      return task;
    }),
};
