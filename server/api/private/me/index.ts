import type { DefineMethods } from 'aspida';
import type { UserEntity } from 'common/types/user';

export type Methods = DefineMethods<{
  get: {
    resBody: UserEntity;
  };
}>;
