import { firebaseAdmin } from '$/middleware/firebaseAdmin';
import type { CookieSerializeOptions } from '@fastify/cookie';
import { defineController } from './$relay';

export type AdditionalRequest = {
  body: { id: string };
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
        const auth = firebaseAdmin.auth();
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const id = req.body?.id ?? '';
        const sessionCookie = await auth.createSessionCookie(id, { expiresIn });

        reply.setCookie('session', sessionCookie, {
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
        const auth = firebaseAdmin.auth();
        const sessionId = req.cookies.session || '';
        const decodedClaims = await auth.verifySessionCookie(sessionId).catch(() => null);

        if (decodedClaims) await auth.revokeRefreshTokens(decodedClaims.sub);

        reply.clearCookie('session', options);
      },
    },
    handler: () => {
      return { status: 200, body: { status: 'success' } };
    },
  },
}));
