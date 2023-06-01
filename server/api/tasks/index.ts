import type { TaskModel } from '$/commonTypesWithClient/models';

export type Methods = {
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
};
