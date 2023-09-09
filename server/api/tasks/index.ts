import type { DefineMethods } from 'aspida';
import type { Maybe, TaskId } from 'commonTypesWithClient/ids';
import type { TaskModel } from 'commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: {
    query?: {
      limit?: number;
    };
    resBody: TaskModel[];
  };

  post: {
    reqBody: {
      label: string;
    };
    resBody: TaskModel;
  };

  patch: {
    reqBody: {
      taskId: Maybe<TaskId>;
      label?: string;
      done?: boolean;
    };
    status: 204;
    resBody: TaskModel;
  };

  delete: {
    reqBody: {
      taskId: Maybe<TaskId>;
    };
    status: 204;
    resBody: TaskModel;
  };
}>;
