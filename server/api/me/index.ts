import type { UserModel } from 'api/@types/models';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: UserModel;
  };
}>;
