import type { DefineMethods } from 'aspida';
import type { TaskModel } from 'commonTypesWithClient/models';

export type Methods = DefineMethods<{
  patch: {
    reqBody: {
      label?: string;
      done?: boolean;
    };
    status: 204;
    resBody: TaskModel;
  };

  delete: {
    status: 204;
    resBody: TaskModel;
  };
}>;
