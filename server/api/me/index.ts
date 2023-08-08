import type { DefineMethods } from 'aspida';
import type { UserModel } from 'commonTypesWithClient/models';

export type Methods = DefineMethods<{
  get: {
    resBody: UserModel;
  };
}>;
