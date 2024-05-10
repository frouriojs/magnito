import type { TaskEntity, TaskUpdateVal } from 'api/@types/task';
import type { UserEntity } from 'api/@types/user';
import assert from 'assert';
import { randomUUID } from 'crypto';
import { deletableTaskIdParser, taskIdParser } from 'service/idParsers';
import { s3 } from 'service/s3Client';
import type { TaskCreateServerVal, TaskDeleteVal, TaskSaveVal } from './taskEntity';

export const taskMethod = {
  create: async (user: UserEntity, val: TaskCreateServerVal): Promise<TaskSaveVal> => {
    const task: TaskEntity = {
      id: taskIdParser.parse(randomUUID()),
      done: false,
      label: val.label,
      image: undefined,
      createdTime: Date.now(),
      author: { id: user.id, displayName: user.displayName },
    };

    if (val.image === undefined) return { task };

    const s3Key = `tasks/images/${randomUUID()}.${val.image.filename.split('.').at(-1)}`;
    const url = await s3.getSignedUrl(s3Key);

    return {
      task: { ...task, image: { s3Key, url } },
      s3Params: { key: s3Key, data: val.image },
    };
  },
  update: (user: UserEntity, task: TaskEntity, val: TaskUpdateVal): TaskSaveVal => {
    assert(user.id === task.author.id);

    return { task: { ...task, ...val } };
  },
  delete: (user: UserEntity, task: TaskEntity): TaskDeleteVal => {
    assert(user.id === task.author.id);

    return { task, deletableId: deletableTaskIdParser.parse(task.id) };
  },
};
