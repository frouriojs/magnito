import { socialUseCase } from 'domain/user/useCase/socialUseCase';
import { brandedId } from 'service/brandedId';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  post: {
    validators: {
      body: z.object({
        grant_type: z.literal('authorization_code'),
        code: z.string(),
        client_id: brandedId.userPoolClient.maybe,
        redirect_uri: z.string().url(),
        code_verifier: z.string(),
      }),
    },
    handler: async ({ body }) => ({ status: 200, body: await socialUseCase.getTokens(body) }),
  },
}));
