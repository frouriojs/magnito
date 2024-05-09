import type { Maybe, TaskId, UserId } from './brandedId';

export type TaskEntity = {
  id: TaskId;
  label: string;
  done: boolean;
  createdTime: number;
  author: { id: UserId; displayName: string | undefined };
};

export type TaskCreateVal = { label: string };

export type TaskUpdateVal = { taskId: Maybe<TaskId>; label?: string; done?: boolean };
