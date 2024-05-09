import type { TaskEntity } from 'api/@types/task';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  patch: {
    reqBody: {
      label?: string;
      done?: boolean;
    };
    status: 204;
    resBody: TaskEntity;
  };

  delete: {
    status: 204;
    resBody: TaskEntity;
  };
}>;
