import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID } from 'service/envValues';
import { returnSuccess } from 'service/returnStatus';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () =>
    returnSuccess({
      userPoolId: DEFAULT_USER_POOL_ID,
      userPoolClientId: DEFAULT_USER_POOL_CLIENT_ID,
    }),
}));
