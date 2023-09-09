import type { UserModel } from '$/commonTypesWithClient/models';
import { getUserRecord } from '$/middleware/firebaseAdmin';
import { usersRepo } from '$/repository/usersRepo';
import { defineHooks } from './$relay';

export type AdditionalRequest = {
  user: UserModel;
};

export default defineHooks(() => ({
  preHandler: async (req, res) => {
    const user = await getUserRecord(req.cookies.session);

    if (!user) {
      res.status(401).send();
      return;
    }

    req.user = usersRepo.recordToModel(user);
  },
}));
