import type { TaskEntity } from 'api/@types/task';
import assert from 'assert';
import type { TaskDeleteVal } from '../model/taskEntity';

export let taskStorage: TaskEntity[] = [];

export const taskCommand = {
  save: (task: TaskEntity): void => {
    taskStorage = taskStorage.some((t) => t.id === task.id)
      ? taskStorage.map((t) => (t.id === task.id ? task : t))
      : (taskStorage = [...taskStorage, task]);
  },
  delete: (val: TaskDeleteVal): void => {
    assert(val.deletable);

    taskStorage = taskStorage.filter((t) => t.id !== val.task.id);
  },
};
