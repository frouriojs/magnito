import type { Maybe, TaskId } from 'api/@types/brandedId';
import type { TaskCreateVal, TaskEntity, TaskUpdateVal } from 'api/@types/task';
import { transaction } from 'service/prismaClient';
import { taskMethod } from '../model/taskMethod';
import { taskCommand } from '../repository/taskCommand';
import { taskQuery } from '../repository/taskQuery';

export const taskUseCase = {
  create: (val: TaskCreateVal): Promise<TaskEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const created = await taskMethod.create(val);

      await taskCommand.save(tx, created);

      return created;
    }),
  update: (val: TaskUpdateVal): Promise<TaskEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const task = await taskQuery.findById(tx, val.taskId);
      const updated = await taskMethod.update(task, val);

      await taskCommand.save(tx, updated);

      return updated;
    }),
  delete: (taskId: Maybe<TaskId>): Promise<TaskEntity> =>
    transaction('RepeatableRead', async (tx) => {
      const task = await taskQuery.findById(tx, taskId);
      const deleted = taskMethod.delete(task);

      await taskCommand.delete(tx, deleted);

      return task;
    }),
};
