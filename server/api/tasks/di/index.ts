import type { DefineMethods } from 'aspida';
import type { TaskModel } from 'commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: {
    resBody: TaskModel[];
  };
}>;
