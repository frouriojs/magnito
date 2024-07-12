import type { DefineMethods } from 'aspida';
import type { TaskEntity } from 'common/types/task';

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
