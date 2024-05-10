import type { Maybe, TaskId, UserId } from './brandedId';

export type TaskEntity = {
  id: TaskId;
  label: string;
  done: boolean;
  createdTime: number;
  image: { url: string; s3Key: string } | undefined;
  author: { id: UserId; displayName: string | undefined };
};

export type TaskCreateVal = { label: string; image?: Blob };

export type TaskUpdateVal = { taskId: Maybe<TaskId>; label?: string; done?: boolean };
