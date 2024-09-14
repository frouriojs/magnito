import type { DefineMethods } from 'aspida';
import type { MaybeId } from 'common/types/brandedId';

export type Methods = DefineMethods<{
  get: {
    query: { client_id: MaybeId['userPoolClient']; logout_uri: string };
    resHeaders: { Location: string };
    status: 302;
  };
}>;
