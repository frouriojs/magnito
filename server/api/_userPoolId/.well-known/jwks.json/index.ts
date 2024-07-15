import type { DefineMethods } from 'aspida';
import type { Jwks } from 'common/types/userPool';

export type Methods = DefineMethods<{
  get: {
    resBody: Jwks;
  };
}>;
