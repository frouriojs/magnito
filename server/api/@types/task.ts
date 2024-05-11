import type { Maybe, TaskId } from './brandedId';

export type TaskEntity = {
  id: TaskId;
  label: string;
  done: boolean;
  createdTime: number;
};

export type TaskCreateVal = { label: string };

export type TaskUpdateVal = { taskId: Maybe<TaskId>; label?: string; done?: boolean };
