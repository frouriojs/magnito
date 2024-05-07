import type { TaskModel } from 'api/@types/models';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: TaskModel[];
  };
}>;
