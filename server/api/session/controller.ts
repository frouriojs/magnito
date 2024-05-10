import type { CookieSerializeOptions } from '@fastify/cookie';
import assert from 'assert';
import { firebaseAdmin } from 'middleware/firebaseAdmin';
import { COOKIE_NAME } from 'service/constants';
import { defineController } from './$relay';

export type AdditionalRequest = {
  body: { idToken: string };
};

const options: CookieSerializeOptions = {
  httpOnly: true,
  secure: true,
  path: '/',
  sameSite: 'none',
};

export default defineController(() => ({
  post: {
    hooks: {
      preHandler: async (req, reply) => {
        assert(req.body);

        const auth = firebaseAdmin.auth();
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const idToken = req.body.idToken;
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

        reply.setCookie(COOKIE_NAME, sessionCookie, {
          ...options,
          expires: new Date(Date.now() + expiresIn),
        });
      },
    },
    handler: () => {
      return { status: 200, body: { status: 'success' } };
    },
  },
  delete: {
    hooks: {
      preHandler: async (req, reply) => {
        assert(req.cookies.session);

        const auth = firebaseAdmin.auth();
        const sessionId = req.cookies.session;
        const decodedClaims = await auth.verifySessionCookie(sessionId).catch(() => null);

        if (decodedClaims) await auth.revokeRefreshTokens(decodedClaims.sub);

        reply.clearCookie(COOKIE_NAME, options);
      },
    },
    handler: () => {
      return { status: 200, body: { status: 'success' } };
    },
  },
}));
