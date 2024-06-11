import type { EntityId, MaybeId } from './brandedId';

export type TaskEntity = {
  id: EntityId['task'];
  label: string;
  done: boolean;
  createdTime: number;
};

export type TaskCreateVal = { label: string };

export type TaskUpdateVal = { taskId: MaybeId['task']; label?: string; done?: boolean };
