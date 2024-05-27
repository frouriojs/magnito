import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: { server: 'ok'; smtp: 'ok' };
  };
}>;
