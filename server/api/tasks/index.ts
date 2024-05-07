import type { Maybe, TaskId } from 'api/@types/brandedId';
import type { TaskModel } from 'api/@types/models';
import type { DefineMethods } from 'aspida';

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
