import type { Maybe, TaskId } from 'api/@types/brandedId';
import type { TaskCreateVal, TaskEntity, TaskUpdateVal } from 'api/@types/task';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query?: {
      limit?: number;
    };
    resBody: TaskEntity[];
  };

  post: {
    reqBody: Maybe<TaskCreateVal>;
    resBody: TaskEntity;
  };

  patch: {
    reqBody: Maybe<TaskUpdateVal>;
    status: 204;
    resBody: TaskEntity;
  };

  delete: {
    reqBody: {
      taskId: Maybe<TaskId>;
    };
    status: 204;
    resBody: TaskEntity;
  };
}>;
