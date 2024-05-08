import type { UserModel } from 'api/@types/models';
import type { TaskCreateVal, TaskEntity, TaskUpdateVal } from 'api/@types/task';
import assert from 'assert';
import { randomUUID } from 'crypto';
import { deletableTaskIdParser, taskIdParser } from 'service/idParsers';
import type { TaskDeleteVal } from './taskEntity';

export const taskMethod = {
  create: (user: UserModel, val: TaskCreateVal): TaskEntity => {
    return {
      id: taskIdParser.parse(randomUUID()),
      label: val.label,
      done: false,
      createdTime: Date.now(),
      author: { id: user.id, displayName: user.displayName },
    };
  },
  update: (user: UserModel, task: TaskEntity, val: TaskUpdateVal): TaskEntity => {
    assert(user.id === task.author.id);

    return { ...task, ...val };
  },
  delete: (user: UserModel, task: TaskEntity): TaskDeleteVal => {
    assert(user.id === task.author.id);

    return { task, deletableId: deletableTaskIdParser.parse(task.id) };
  },
};
