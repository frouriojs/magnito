import type { MaybeId } from 'common/types/brandedId';
import type { TaskCreateVal, TaskEntity, TaskUpdateVal } from 'common/types/task';
import { transaction } from 'service/prismaClient';
import { taskMethod } from '../model/taskMethod';
import { taskCommand } from '../repository/taskCommand';
import { taskQuery } from '../repository/taskQuery';

export const taskUseCase = {
  create: (val: TaskCreateVal): Promise<TaskEntity> =>
    transaction(async (tx) => {
      const created = await taskMethod.create(val);

      await taskCommand.save(tx, created);

      return created;
    }),
  update: (val: TaskUpdateVal): Promise<TaskEntity> =>
    transaction(async (tx) => {
      const task = await taskQuery.findById(tx, val.taskId);
      const updated = await taskMethod.update(task, val);

      await taskCommand.save(tx, updated);

      return updated;
    }),
  delete: (taskId: MaybeId['task']): Promise<TaskEntity> =>
    transaction(async (tx) => {
      const task = await taskQuery.findById(tx, taskId);
      const deleted = taskMethod.delete(task);

      await taskCommand.delete(tx, deleted);

      return task;
    }),
};
