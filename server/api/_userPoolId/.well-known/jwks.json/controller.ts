import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

export default defineController(() => ({
  get: ({ params }) =>
    userPoolQuery
      .findJwks(prismaClient, params.userPoolId)
      .then((jwks) => ({ status: 200, body: jwks })),
}));
