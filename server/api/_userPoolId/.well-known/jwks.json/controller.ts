import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { prismaClient } from 'service/prismaClient';
import { returnGetError, returnSuccess } from 'service/returnStatus';
import { defineController } from './$relay';

export default defineController(() => ({
  get: ({ params }) =>
    userPoolQuery
      .findJwks(prismaClient, params.userPoolId)
      .then(returnSuccess)
      .catch(returnGetError),
}));
