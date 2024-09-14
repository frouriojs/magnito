import { brandedId } from 'service/brandedId';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  get: {
    validators: {
      query: z.object({ client_id: brandedId.userPoolClient.maybe, logout_uri: z.string() }),
    },
    handler: ({ query }) => ({ status: 302, headers: { Location: query.logout_uri } }),
  },
}));
