import type { DefineMethods } from 'aspida';
import type { Jwks } from 'common/types/auth';

export type Methods = DefineMethods<{
  get: {
    resBody: Jwks;
  };
}>;
