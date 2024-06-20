import type { EntityId } from 'api/@types/brandedId';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    resBody: { userPoolId: EntityId['userPool']; userPoolClientId: EntityId['userPoolClient'] };
  };
}>;
