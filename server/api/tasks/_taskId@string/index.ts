import type { TaskModel } from 'api/@types/models';
import type { DefineMethods } from 'aspida';

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
