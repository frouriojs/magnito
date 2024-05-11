import type { DeletableTaskId } from 'api/@types/brandedId';
import type { TaskEntity } from 'api/@types/task';

export type TaskDeleteVal = { deletableId: DeletableTaskId; task: TaskEntity };
