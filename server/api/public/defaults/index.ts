import type { DefineMethods } from 'aspida';
import type { EntityId } from 'common/types/brandedId';

export type Methods = DefineMethods<{
  get: {
    resBody: { userPoolId: EntityId['userPool']; userPoolClientId: EntityId['userPoolClient'] };
  };
}>;
