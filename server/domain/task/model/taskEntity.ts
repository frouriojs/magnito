import type { DeletableTaskId } from 'api/@types/brandedId';
import type { TaskEntity } from 'api/@types/task';
import type { DeepReadonly } from 'ts-essentials';

export type TaskDeleteVal = DeepReadonly<{ deletableId: DeletableTaskId; task: TaskEntity }>;
