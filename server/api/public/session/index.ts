import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  post: {
    reqBody: { jwt: string };
    resBody: { status: 'success' };
  };
  delete: {
    resBody: { status: 'success' };
  };
}>;
