import type { Task } from '$prisma/client';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  patch: {
    reqBody: Partial<Pick<Task, 'label' | 'done'>>;
    status: 204;
  };
  delete: {
    status: 204;
  };
}>;
