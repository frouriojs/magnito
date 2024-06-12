import type { UserEntity } from 'api/@types/user';
import assert from 'assert';
import { userQuery } from 'domain/user/repository/userQuery';
import type { JWT_PROP_NAME } from 'service/constants';
import { prismaClient } from 'service/prismaClient';
import type { IdTokenJwt } from 'service/types';
import { defineHooks } from './$relay';

export type AdditionalRequest = {
  [Key in typeof JWT_PROP_NAME]: IdTokenJwt;
} & { user: UserEntity };

export default defineHooks(() => ({
  onRequest: async (req, res) => {
    try {
      await req.jwtVerify({ onlyCookie: true });
    } catch (e) {
      res.status(401).send();
    }

    assert(req.idToken);

    req.user = await userQuery.findById(prismaClient, req.idToken.sub);
  },
}));
