import type { Maybe, TaskId } from 'api/@types/brandedId';
import type { TaskCreateVal, TaskEntity, TaskUpdateVal } from 'api/@types/task';
import { taskMethod } from '../model/taskMethod';
import { taskCommand } from '../repository/taskCommand';
import { taskQuery } from '../repository/taskQuery';

export const taskUseCase = {
  create: (val: TaskCreateVal): TaskEntity => {
    const created = taskMethod.create(val);

    taskCommand.save(created);

    return created;
  },
  update: (val: TaskUpdateVal): TaskEntity => {
    const task = taskQuery.findById(val.taskId);
    const updated = taskMethod.update(task, val);

    taskCommand.save(updated);

    return updated;
  },
  delete: (taskId: Maybe<TaskId>): TaskEntity => {
    const task = taskQuery.findById(taskId);
    const deleted = taskMethod.delete(task);

    taskCommand.delete(deleted);

    return task;
  },
};
