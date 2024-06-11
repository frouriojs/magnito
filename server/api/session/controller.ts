import type { CookieSerializeOptions } from '@fastify/cookie';
import assert from 'assert';
import { COOKIE_NAME } from 'service/constants';
import { z } from 'zod';
import type { Methods } from '.';
import { defineController } from './$relay';

export type AdditionalRequest = {
  body: Methods['post']['reqBody'];
};

export const options: CookieSerializeOptions = {
  httpOnly: true,
  secure: true,
  path: '/',
  sameSite: 'none',
};

export default defineController(() => ({
  post: {
    validators: { body: z.object({ jwt: z.string() }) },
    hooks: {
      preHandler: (req, reply, done) => {
        assert(req.body);

        const expiresIn = 60 * 60 * 24 * 5 * 1000;

        reply.setCookie(COOKIE_NAME, req.body.jwt, {
          ...options,
          expires: new Date(Date.now() + expiresIn),
        });

        done();
      },
    },
    handler: () => {
      return { status: 200, body: { status: 'success' } };
    },
  },
}));
