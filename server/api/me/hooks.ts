import { getVerifiedUser } from '$/middleware/firebaseAdmin'
import type { VerifiedUser } from '$/types'
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
      id: user.uid,
      email: user.email ?? '',
      displayName: user.displayName,
      photoURL: user.photoURL,
    }
  },
}))
