import type { DefineMethods } from 'aspida';
import type { TaskModel } from 'commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: {
    query?: {
      limit?: number;
    };

    resBody: TaskModel[];
  };
  post: {
    reqBody: Pick<TaskModel, 'label'>;
    resBody: TaskModel;
  };
}>;
