import type { TaskEntity } from 'api/@types/task';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: TaskEntity[];
  };
}>;
