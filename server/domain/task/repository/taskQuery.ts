import type { Maybe, TaskId } from 'api/@types/brandedId';
import type { TaskEntity } from 'api/@types/task';
import assert from 'assert';
import { taskStorage } from './taskCommand';

export const taskQuery = {
  findMany: (): TaskEntity[] => taskStorage,
  findById: (taskId: Maybe<TaskId>): TaskEntity => {
    const task = taskStorage.find((t) => t.id === taskId);
    assert(task);

    return task;
  },
};
