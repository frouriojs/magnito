import { getUserModel } from '$/middleware/firebaseAdmin';
import { userIdParser } from '$/service/idParsers';
import type { UserModel } from 'commonTypesWithClient/models';
import { defineHooks } from './$relay';

export type AdditionalRequest = {
  user: UserModel;
};

export default defineHooks(() => ({
  preHandler: async (req, res) => {
    const user = await getUserModel(req.cookies.session);

    if (!user) {
      res.status(401).send();
      return;
    }

    req.user = {
      id: userIdParser.parse(user.uid),
      email: user.email ?? '',
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  },
}));
