import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: { version: string; server: 'ok'; db: 'ok'; smtp: 'ok'; cognito: 'ok' };
  };
}>;
