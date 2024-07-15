import type { UserEntity } from 'common/types/user';
import { userQuery } from 'domain/user/repository/userQuery';
import { prismaClient } from 'service/prismaClient';
import type { IdTokenJwt } from 'service/types';
import { defineHooks } from './$relay';

export type AdditionalRequest = { user: UserEntity };

export default defineHooks(() => ({
  onRequest: async (req, res) => {
    req.user = await req
      .jwtVerify<IdTokenJwt>({ onlyCookie: true })
      .then((idToken) => userQuery.findById(prismaClient, idToken.sub))
      .catch((e) => res.status(401).send((e as Error).message));
  },
}));
