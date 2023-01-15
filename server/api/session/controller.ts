import { firebaseAdmin } from '$/middleware/firebaseAdmin'
import { defineController } from './$relay'

export type AdditionalRequest = {
  body: {
    id: string
  }
}

export default defineController(() => ({
  post: {
    hooks: {
      preHandler: async (req, reply) => {
        const auth = firebaseAdmin.auth()
        const expiresIn = 60 * 60 * 24 * 5 * 1000
        const id = req.body?.id ?? ''
        const sessionCookie = await auth.createSessionCookie(id, { expiresIn })

        reply.setCookie('session', sessionCookie, {
          expires: new Date(Date.now() + expiresIn),
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          path: '/',
          sameSite: 'lax',
        })
      },
    },
    handler: () => {
      return { status: 200, body: { status: 'success' } }
    },
  },
  delete: {
    hooks: {
      preHandler: async (req, reply) => {
        const auth = firebaseAdmin.auth()
        const sessionId = req.cookies.session || ''
        const decodedClaims = await auth.verifySessionCookie(sessionId).catch(() => null)

        if (decodedClaims) {
          await auth.revokeRefreshTokens(decodedClaims.sub)
        }

        reply.clearCookie('session', { path: '/' })
      },
    },
    handler: () => {
      return { status: 200, body: { status: 'success' } }
    },
  },
}))
