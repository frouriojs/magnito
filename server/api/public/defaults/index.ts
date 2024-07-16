import type { DefineMethods } from 'aspida';
import type { DefaultConfigs } from 'common/types/api';

export type Methods = DefineMethods<{
  get: { resBody: DefaultConfigs };
}>;
