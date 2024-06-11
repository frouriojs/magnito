import { COOKIE_NAME } from 'service/constants';
import { options } from '../controller';
import { defineController } from './$relay';

export default defineController(() => ({
  post: {
    hooks: {
      preHandler: (_, reply, done) => {
        reply.clearCookie(COOKIE_NAME, options);
        done();
      },
    },
    handler: () => {
      return { status: 200, body: { status: 'success' } };
    },
  },
}));
