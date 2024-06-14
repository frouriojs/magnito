import { returnSuccess } from 'service/returnStatus';
import { defineController } from './$relay';

export default defineController(() => ({
  get: ({ user }) => returnSuccess(user),
}));
