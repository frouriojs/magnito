import type { VerifiedUser } from '$/commonWithClient'
import { verifiedUserIdParser } from '$/commonWithClient/idParsers'
import { getVerifiedUser } from '$/middleware/firebaseAdmin'
import { defineHooks } from './$relay'

export type AdditionalRequest = {
  user: VerifiedUser
}

export default defineHooks(() => ({
  preHandler: async (req, res) => {
    const user = await getVerifiedUser(req.cookies.session)

    if (!user) {
      res.status(401).send()
      return
    }

    req.user = {
      id: verifiedUserIdParser.parse(user.uid),
      email: user.email ?? '',
      displayName: user.displayName,
      photoURL: user.photoURL,
    }
  },
}))
