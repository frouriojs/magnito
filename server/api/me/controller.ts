import { defineController } from './$relay';

export default defineController(() => ({
  get: ({ user }) => {
    return { status: 200, body: user };
  },
}));
