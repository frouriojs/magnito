import type { TaskModel } from '$/commonTypesWithClient/models';
import type { DefineMethods } from 'aspida';

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
