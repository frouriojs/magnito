import type { TaskCreateVal, TaskEntity, TaskUpdateVal } from 'api/@types/task';
import assert from 'assert';
import { randomUUID } from 'crypto';
import { deletableTaskIdParser, taskIdParser } from 'service/idParsers';
import type { TaskDeleteVal } from './taskEntity';

export const taskMethod = {
  create: (val: TaskCreateVal): TaskEntity => {
    return {
      id: taskIdParser.parse(randomUUID()),
      done: false,
      label: val.label,
      createdTime: Date.now(),
    };
  },
  update: (task: TaskEntity, val: TaskUpdateVal): TaskEntity => {
    assert(task.id === val.taskId);

    return { ...task, ...val };
  },
  delete: (task: TaskEntity): TaskDeleteVal => {
    return { task, deletableId: deletableTaskIdParser.parse(task.id) };
  },
};
