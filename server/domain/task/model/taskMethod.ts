import assert from 'assert';
import type { TaskCreateVal, TaskEntity, TaskUpdateVal } from 'common/types/task';
import { brandedId } from 'service/brandedId';
import { ulid } from 'ulid';
import type { TaskDeleteVal } from './taskEntity';

export const taskMethod = {
  create: (val: TaskCreateVal): TaskEntity => {
    return {
      id: brandedId.task.entity.parse(ulid()),
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
    return { deletable: true, task };
  },
};
