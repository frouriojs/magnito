import { DEFAULT_USER_POOL_CLIENT_ID, DEFAULT_USER_POOL_ID } from 'service/envValues';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({
    status: 200,
    body: { userPoolId: DEFAULT_USER_POOL_ID, userPoolClientId: DEFAULT_USER_POOL_CLIENT_ID },
  }),
}));
