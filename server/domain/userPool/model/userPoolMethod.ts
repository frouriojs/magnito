import type { EntityId } from 'api/@types/brandedId';
import type { UserPoolClientEntity, UserPoolEntity } from 'api/@types/userPool';
import { genPrivatekey } from 'service/privateKey';

export const userPoolMethod = {
  create: (val: { id: EntityId['userPool'] }): UserPoolEntity => ({
    id: val.id,
    privateKey: genPrivatekey(),
    createdTime: Date.now(),
  }),
  createClient: (val: {
    id: EntityId['userPoolClient'];
    userPoolId: EntityId['userPool'];
  }): UserPoolClientEntity => ({ id: val.id, userPoolId: val.userPoolId, createdTime: Date.now() }),
};
