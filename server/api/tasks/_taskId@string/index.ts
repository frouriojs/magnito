import type { Task } from '$prisma/client';

export type Methods = {
  patch: {
    reqBody: Partial<Pick<Task, 'label' | 'done'>>;
    status: 204;
  };
  delete: {
    status: 204;
  };
};
