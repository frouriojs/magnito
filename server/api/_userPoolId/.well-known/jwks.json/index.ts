import { Jwks } from 'api/@types/auth';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: Jwks;
  };
}>;
