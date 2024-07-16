import {
  ACCESS_KEY,
  DEFAULT_USER_POOL_CLIENT_ID,
  DEFAULT_USER_POOL_ID,
  REGION,
  SECRET_KEY,
} from 'service/envValues';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({
    status: 200,
    body: {
      userPoolId: DEFAULT_USER_POOL_ID,
      userPoolClientId: DEFAULT_USER_POOL_CLIENT_ID,
      region: REGION,
      accessKey: ACCESS_KEY,
      secretKey: SECRET_KEY,
    },
  }),
}));
