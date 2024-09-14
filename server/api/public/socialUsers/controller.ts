import { PROVIDER_LIST } from 'common/constants';
import { userQuery } from 'domain/user/repository/userQuery';
import { socialUseCase } from 'domain/user/useCase/socialUseCase';
import { brandedId } from 'service/brandedId';
import { prismaClient } from 'service/prismaClient';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  get: {
    validators: { query: z.object({ userPoolClientId: brandedId.userPoolClient.maybe }) },
    handler: async ({ query }) => ({
      status: 200,
      body: await userQuery.listSocials(prismaClient, query.userPoolClientId),
    }),
  },
  post: {
    validators: {
      body: z.object({
        provider: z.enum(PROVIDER_LIST),
        name: z.string(),
        email: z.string(),
        codeChallenge: z.string(),
        photoUrl: z.string().optional(),
        userPoolClientId: brandedId.userPoolClient.maybe,
      }),
    },
    handler: async ({ body }) => ({ status: 200, body: await socialUseCase.createUser(body) }),
  },
  patch: {
    validators: { body: z.object({ id: brandedId.socialUser.maybe, codeChallenge: z.string() }) },
    handler: async ({ body }) => ({
      status: 200,
      body: await socialUseCase.updateCodeChallenge(body),
    }),
  },
}));
